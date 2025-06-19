#ifndef BLOOM_FILTER_H
#define BLOOM_FILTER_H

#include <functional>
#include <memory>
#include <vector>
#include "../HashFunctions/HashFunction.h"
#include "../HashFunctions/DoubleHash.h"
#include "../HashFunctions/HashFunctionFactory.h"
#include "../HashFunctions/StdHash.h"

class BloomFilter {
    private:
    std::vector<bool> bits;
    std::vector<std::shared_ptr<HashFunction>> hashes;
    size_t size;
    public: 
    //the constructor
    BloomFilter(size_t size, const std::vector<std::shared_ptr<HashFunction>>& hashes);
    // func that checks if the url is found in th bloom filter
    bool isFound(const std::string& element) const;
    //a func to add a url
    void add(const std::string& element);
    // a func to get the size of the bloom filter
    size_t getSize() const;
    //a func to get the number of the hash functions
    size_t getNumberOfHashes() const;
    //a func to get the arary of bits
    const std::vector<bool>& getArray() const;
    //a func to set the array of bits
    void setarray(const std::vector<bool>& newArray);
};
#endif