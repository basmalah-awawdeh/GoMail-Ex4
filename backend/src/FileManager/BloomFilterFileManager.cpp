#include "BloomFilterFileManager.h"
#include <fstream>
#include <vector>
#include <iostream>
#include <filesystem>

#define BYTES 8
BloomFilterFileManager::BloomFilterFileManager(const std::string& filename)
    : bit_array_filename(filename) {}

//saving bloomfilter to file
    bool BloomFilterFileManager::save(const BlacklistURL& blacklist) {

    // opening fie for writing
    std::ofstream bit_file(bit_array_filename, std::ios::binary);
    if (!(bit_file)) {
        return false;
    }

    const auto& bit_array = blacklist.getBloomFilter()->getArray();
    size_t size = bit_array.size();

    //writing size to file in bits
    bit_file.write(reinterpret_cast<const char*>(&size), sizeof(size));

    //converting to bytes
    std::vector<unsigned char> bytes((size + 7) / BYTES);
    for (size_t i = 0; i < size; ++i) {
        if (bit_array[i]) {
            bytes[i / BYTES] |= (1 << (i % BYTES));
        }
    }
    
    //writing size to file in bytes
    bit_file.write(reinterpret_cast<const char*>(bytes.data()), bytes.size());
    return true;
}
bool BloomFilterFileManager::load(BlacklistURL& blacklist) {

    std::ifstream bit_file(bit_array_filename, std::ios::binary);
    if (!(bit_file)) {
        return false;
    }

    size_t size; 
   
    //read size of bit array
    bit_file.read(reinterpret_cast<char*>(&size), sizeof(size));
    if (size != blacklist.getBloomFilter()->getSize()) {
        return false; // Size mismatch
    }

    //reading  bytes from file
    std::vector<unsigned char> bytes((size + 7) / BYTES);
    bit_file.read(reinterpret_cast<char*>(bytes.data()), bytes.size());

    // converting bytes back to  vector<bool> 
    std::vector<bool> bit_array(size, false);
    for (size_t i = 0; i < size; ++i) {
        if (bytes[i / BYTES] & (1 << (i % BYTES))) {
            bit_array[i] = true;
        }
    }
    blacklist.getBloomFilter()->setarray(bit_array);
    return true;
}

// checking if the bloom filter file is exist
bool BloomFilterFileManager::filesExist() const {
    //chicking if  file is exist in the given path
    return std::filesystem::exists(bit_array_filename);
}
