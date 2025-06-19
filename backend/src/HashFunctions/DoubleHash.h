#ifndef DOUBLE_HASH_H
#define DOUBLE_HASH_H

#include "HashFunction.h"

// double hash implementation that applies std::hash two times
class DoubleStdHash : public HashFunction {
    public:
        size_t hash(const std::string& url) const override;
    };
#endif
