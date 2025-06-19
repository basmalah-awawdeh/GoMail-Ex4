#include "StdHash.h"
//applying hash once
size_t StdHash::hash(const std::string& url) const{
    return std::hash<std::string>{}(url);
}
