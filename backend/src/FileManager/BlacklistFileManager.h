#ifndef BLACKLIST_FILE_MANAGER_H
#define BLACKLIST_FILE_MANAGER_H

#include "IFileManager.h"
#include "../UrlCheck/url_blacklist.h"
#include <string>

class BlacklistFileManager : public IFileManager {
private:
    std::string blacklist_filename; 
public:
BlacklistFileManager(const std::string& filename = "data/blacklist.txt");
    //saving blakclist to file and returning true if added sucessfuly else false
    bool save(const BlacklistURL& blacklist) override;
    // loading blacklist from file, returning true if ended successfuly else false
    bool load(BlacklistURL& blacklist) override;
    //checking if blacklist file exist, if yes return true o.w false
    bool filesExist() const override;
};

#endif 
