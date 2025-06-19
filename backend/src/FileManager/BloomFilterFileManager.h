#ifndef BLOOM_FILTER_FILE_MANAGER_H
#define BLOOM_FILTER_FILE_MANAGER_H

#include "IFileManager.h"
#include "../UrlCheck/url_blacklist.h"
#include <string>
class BloomFilterFileManager : public IFileManager {
private:
    std::string bit_array_filename;
public:
BloomFilterFileManager(const std::string& filename = "../data/bloom_filter.txt");
//saving bloomfilter bit array to file, if succeeded return true o.w false
    bool save(const BlacklistURL& blacklist) override;
    //loading bloomfilter bit array from file, if succeeded return true o.w false
    bool load(BlacklistURL& blacklist) override;
    //checking if bloomfilter file exist, if yes return true o.w false
    bool filesExist() const override;
};
#endif 
