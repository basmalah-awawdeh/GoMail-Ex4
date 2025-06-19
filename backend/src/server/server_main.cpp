#include <iostream>
#include <thread>
#include <netinet/in.h>
#include <unistd.h>
#include <cstring>
#include <sstream>

#include "../UrlCheck/url_blacklist.h"
#include "../UrlCheck/url_validation.h"
#include "../FileManager/BlacklistFileManager.h"
#include "../HashFunctions/HashFunctionFactory.h"
#include "../BloomFilter/BloomFilter.h"
#include "../FileManager/BloomFilterFileManager.h"
#include "../requests/requestCheck.h"
#include "server_arg_validation.h"

#define BUFFER_SIZE 4096
#define MAX_CONN 10
// in this func we handle the cleint's commands
void clientHandling(int clientSocket,
                  BlacklistURL& blacklist,
                  BlacklistFileManager& manager,
                  BloomFilterFileManager& bloomManager) {
    char buffer[BUFFER_SIZE];
    //giving zero values
    memset(buffer, 0, BUFFER_SIZE);
    // reding the client`s input data
    ssize_t bytesRead = read(clientSocket, buffer, BUFFER_SIZE - 1);
    if (bytesRead <= 0) {
        close(clientSocket);
        return;
    }
    std::string request(buffer);
    //check the client's request
    std::string response = requestCheck(request, blacklist, manager, bloomManager);
    send(clientSocket, response.c_str(), response.size(), 0);
    close(clientSocket);
}

int main(int argc, char* argv[]) {
    int port, bloomFilter_size, opt,server_fd, id, clientSocket;
    //chcking if our args are correct
    if (!validateArgs(argc, argv)) {
        return 1;
    }
    //parsing the input arguments
    port = std::stoi(argv[1]);
    bloomFilter_size = std::stoi(argv[2]);
    std::vector<std::shared_ptr<HashFunction>> hashFunctions;
    //creating hash funcs according to the args
    for (int i = 3; i < argc; ++i) {
        id = std::stoi(argv[i]);
        hashFunctions.push_back(MakeHash::createHashFunction(id));
    }
    //checking that we have hash
    if (hashFunctions.empty()) {
        return 1;
    }
    //here we save the data
    BloomFilterFileManager bloomManager("data/bloom_filter.txt");
    BlacklistFileManager manager("data/blacklist.txt");
    auto filter = std::make_shared<BloomFilter>(bloomFilter_size, hashFunctions);
    BlacklistURL blacklist(filter);
    manager.load(blacklist);
    manager.save(blacklist);
    bloomManager.load(blacklist);
    bloomManager.save(blacklist);
    //creating tcp socket and check if succeeded
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == -1) {
        return 1;
    }
    sockaddr_in address{};
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);
    opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR | SO_REUSEPORT, &opt, sizeof(opt));
    //binding our socket to ip and check if succeeded
    if (bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        return 1;
    }
    //listening for the client and check if suceeded
    if (listen(server_fd, MAX_CONN) < 0) {
        return 1;
    }
    //our loop to accept a client
    while (true) {
        clientSocket = accept(server_fd, nullptr, nullptr);
        if (clientSocket >= 0) {
        //handling connection using threads
            std::thread(clientHandling, clientSocket, std::ref(blacklist), std::ref(manager), std::ref(bloomManager)).detach();
        }
    }
    // close(server_fd);
    // return 0;
}

