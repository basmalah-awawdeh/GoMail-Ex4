#include <string>
#include <sstream>
#include "../UrlCheck/url_blacklist.h"
#include "../FileManager/BlacklistFileManager.h"
#include "../BloomFilter/BloomFilter.h"
#include "../FileManager/BloomFilterFileManager.h"
//in this func we check the client's requests
std::string requestCheck(const std::string& request,
                           BlacklistURL& blacklist,
                           BlacklistFileManager& manager,
                           BloomFilterFileManager& bloomFileManager);
