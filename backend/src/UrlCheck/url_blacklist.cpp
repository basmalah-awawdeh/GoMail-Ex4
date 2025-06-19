#include "url_blacklist.h"
#include <algorithm>
#include "../HashFunctions/HashFunctionFactory.h"

BlacklistURL::BlacklistURL(std::shared_ptr<BloomFilter> bloomfilter)
    : bloomfilter(bloomfilter) {
}

// adding  Url to blacklist
void BlacklistURL::addURL(const std::string& url) {
    bloomfilter->add(url);
    blacklisted.push_back(url);
}

//if Url is blacklist ==>true,o.w false 
bool BlacklistURL::isBlacklisted(const std::string& url) const {
    return std::find(blacklisted.begin(), blacklisted.end(), url) != blacklisted.end();
}

// if Url is actually in blacklist and not falsePositive ==> true, o.w false 
bool BlacklistURL::isFalsePositive(const std::string& url) const {
    bool falsePositive =std::find(blacklisted.begin(), blacklisted.end(), url) != blacklisted.end();
    return falsePositive;
}

// getting blacklist Urls
const std::vector<std::string>& BlacklistURL::getBlacklisted() const {
    return blacklisted;
}

// setting blacklist URLs
void BlacklistURL::setBlacklisted(const std::vector<std::string>& urls) {
    blacklisted = urls;
}

//getting bloomfilter
std::shared_ptr<BloomFilter> BlacklistURL::getBloomFilter() const {
    return bloomfilter;
}
bool BlacklistURL::removeURL(const std::string& url) {
    auto it = std::find(blacklisted.begin(), blacklisted.end(), url);
    if (it != blacklisted.end()) {
        blacklisted.erase(it);

        return true;
    }
    return false;
}

BlacklistURL::BlacklistURL() {
    // Default BloomFilter size and hash function(s)
    std::vector<int> hash_types = {1}; // or whatever default type you use
    std::vector<std::shared_ptr<HashFunction>> hash_functions;
    for (int t : hash_types) {
        hash_functions.push_back(MakeHash::createHashFunction(t));
    }
    bloomfilter = std::make_shared<BloomFilter>(1000, hash_functions);
}
