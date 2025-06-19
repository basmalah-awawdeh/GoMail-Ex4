#include "CLI.h"
#include "../HashFunctions/HashFunctionFactory.h"
#include "../HashFunctions/StdHash.h"
#include "../HashFunctions/DoubleHash.h"
#include "../HashFunctions/HashFunction.h"
#include "../UrlCheck/url_validation.h"
#include <sstream>
#include <iostream>

//this func create hash funcs acording to the types using the make hash
std::vector<std::shared_ptr<HashFunction>> createHashFunctionsFromTypes(const std::vector<int>& hash_types) {
    std::vector<std::shared_ptr<HashFunction>> hash_functions;
    for (int type : hash_types) {
        hash_functions.push_back(MakeHash::createHashFunction(type));
    }
    return hash_functions;
}

// // this func find the beginning (first element) of the string 
size_t getBeginning(const std::string& str) {
    return str.find_first_of("0123456789");
}

// parsing config for size and hash function types
bool inputExtracting(const std::string& line, int& size, std::vector<int>& hash_types) {
    size_t pos = getBeginning(line);
    if (pos == std::string::npos) {
        return false; // No digits found
    }

    std::istringstream iss(line.substr(pos));

    //here we read the size and check if invaled
    if (!(iss >> size)) {
        return false;
    }

    // reads hash types
    int type;
    while (iss >> type) {
        //adding hashes to vecrors
        hash_types.push_back(type); 
    }
    //return when it is not empty
    return !(hash_types.empty());
}

// creating bloom filter with size and hash functions from inptu of user
std::shared_ptr<BloomFilter> blommFilterhashesCreating(int size, const std::vector<int>& hash_types) {
    auto hash_functions = createHashFunctionsFromTypes(hash_types);
    std::shared_ptr<BloomFilter> bloom_filter_pointer = std::make_shared<BloomFilter>(size, hash_functions);
    return bloom_filter_pointer;
}

// here we're handling user commands (adding/checking) in a loop
void commandsHandling(BlacklistFileManager& blacklistFileManager, BloomFilterFileManager& bloomFileManager, BlacklistURL& blacklist) {
    std::string line;
    int command;
    std::string url;
    bool actuallyBlacklisted;
    while (std::getline(std::cin, line)) {
        size_t pos = getBeginning(line);
        //skipping when no degits
        if (pos==std::string::npos) {
            continue;
        }

        // extracting commands from string, ignore invalid input
        std::istringstream cmdStream(line.substr(pos));        
        if (!(cmdStream >> command)) {
            continue; 
        }

        std::getline(cmdStream >> std::ws, url);
//1 ==> adding valid url
        if(command==1){
                if (!url.empty() && isValidURL(url)) {
                    blacklist.addURL(url);
                    blacklistFileManager.save(blacklist);
                    bloomFileManager.save(blacklist);
                }
            }
            //2 ===> checking if url is blacklisted
            if(command==2) {
                if (blacklist.isBlacklisted(url)) {
                     actuallyBlacklisted = blacklist.isFalsePositive(url);
                    std::cout << "true " << (actuallyBlacklisted ? "true" : "false") << std::endl;
                }else {
                    std::cout << "false" << std::endl; 
                }
            }
            else{
                continue;
        }
    }
}
