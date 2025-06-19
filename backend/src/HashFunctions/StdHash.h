#ifndef STD_HASH_H
#define STD_HASH_H

#include "HashFunction.h"

// standard hash implementation
class StdHash : public HashFunction {
    public:
        size_t hash(const std::string& url) const override;
    };
#endif 
