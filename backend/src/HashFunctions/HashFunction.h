#ifndef HASH_FUNCTION_H
#define HASH_FUNCTION_H

#include <memory>
#include <string>
#include <functional>

// abstract base class for hash functions
class HashFunction {
    public:
        virtual size_t hash(const std::string& url) const = 0;
        virtual ~HashFunction() = default;
    };

#endif
