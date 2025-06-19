#ifndef URL_BLACKLIST_H
#define URL_BLACKLIST_H

#include <string>
#include <vector>
#include <memory>
#include "../BloomFilter/BloomFilter.h"
#include "../HashFunctions/HashFunctionFactory.h"

class BlacklistURL {
private:
    std::shared_ptr<BloomFilter> bloomfilter;
    //blacklitsed urls list
    std::vector<std::string> blacklisted; 
    
public:
    BlacklistURL(std::shared_ptr<BloomFilter> bloomfilter);
    BlacklistURL();

    
    // a func that add URL to blacklist
    void addURL(const std::string& url);
    
    //a func that checks if URL is blacklisted
    bool isBlacklisted(const std::string& url) const;
    
    // checking false positives
    bool isFalsePositive(const std::string& url) const;
    
    // getting all blacklist url
    const std::vector<std::string>& getBlacklisted() const;
    
    // setting blacklisted URLs
    void setBlacklisted(const std::vector<std::string>& urls);
    
    // getting bloom filter
    std::shared_ptr<BloomFilter> getBloomFilter() const;
    bool removeURL(const std::string& url);

};

#endif 