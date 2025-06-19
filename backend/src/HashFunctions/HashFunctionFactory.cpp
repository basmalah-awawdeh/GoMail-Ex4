#include "HashFunctionFactory.h"
#include "StdHash.h"
#include "DoubleHash.h"
//creating hash faunctions by chcking the input if 1 ==> stdHash, if 2 ==> double hash
std::shared_ptr<HashFunction> MakeHash::createHashFunction(int input){
    if(input==1){
        return std::make_shared<StdHash>();
    }
    if(input==2){
        return std::make_shared<DoubleStdHash>();
    }
    return std::make_shared<StdHash>();
}
