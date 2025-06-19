#ifndef CLI_H
#define CLI_H

#include <string>
#include <vector>
#include <memory>
#include "../BloomFilter/BloomFilter.h"
#include "../HashFunctions/HashFunction.h"
#include "../UrlCheck/url_blacklist.h"
#include "../FileManager/BlacklistFileManager.h"
#include "../FileManager/BloomFilterFileManager.h"

//creating hash functions according to the types in inupt
std::vector<std::shared_ptr<HashFunction>> createHashFunctionsFromTypes(const std::vector<int>& hash_types);

// extracting hash types and bloom filter size
bool inputExtracting(const std::string& line, int& size, std::vector<int>& hash_types);

//creating blomo filter with size and hash funcs
std::shared_ptr<BloomFilter> blommFilterhashesCreating(int size, const std::vector<int>& hash_types);

//handling input commands for exampel add and check
void commandsHandling(BlacklistFileManager& blacklistFileManager, BloomFilterFileManager& bloomFileManager, BlacklistURL& blacklist);

#endif 
