#ifndef HASH_FUNCTION_FACTORY_H
#define HASH_FUNCTION_FACTORY_H

#include "HashFunction.h"
#include <memory>

// factory to create hash functions
class MakeHash {
    public:
        static std::shared_ptr<HashFunction> createHashFunction(int input);
    };

#endif 
