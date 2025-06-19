#include "BlacklistFileManager.h"
#include <fstream>
#include <iostream>
#include <filesystem>


//initalizing  file manager constructor
BlacklistFileManager::BlacklistFileManager(const std::string& filename)
    : blacklist_filename(filename) {}


// saving blacklist data to file
bool BlacklistFileManager::save(const BlacklistURL& blacklist) {
    std::ofstream blacklist_file(blacklist_filename);
    if (!(blacklist_file)) {
        return false;
    }
    // write blacklisted url to file
    for (const auto& url : blacklist.getBlacklisted()) {
        blacklist_file << url << std::endl;
    }
    return true;
}

//loading  blacklist data from file
bool BlacklistFileManager::load(BlacklistURL& blacklist) {
        //storng readed urls
        std::vector<std::string> urls;
        std::string url;

    std::ifstream blacklist_file(blacklist_filename);
    if (!(blacklist_file)) {
        return false;
    }
    //read line by line and isnert to vector
    while (std::getline(blacklist_file, url)) {
        urls.push_back(url);
    }
    blacklist.setBlacklisted(urls);
    return true;
}

//checking if  blacklist file exists
bool BlacklistFileManager::filesExist() const {
    bool exists = std::filesystem::exists(blacklist_filename);
    return exists;
}
