#include "DoubleHash.h"
#include <functional>
//hashing two times by converting to string, first hash, converting to string again, then second hash
size_t DoubleStdHash::hash(const std::string& url) const{
    std::string first = std::to_string(std::hash<std::string>{}(url));
    size_t second = std::hash<std::string>{}(first);
    return second;
}

