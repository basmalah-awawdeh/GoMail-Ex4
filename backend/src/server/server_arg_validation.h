#include <string>
#include "../HashFunctions/HashFunctionFactory.h"
#include "../HashFunctions/DoubleHash.h"
#include "../HashFunctions/HashFunction.h"
#include "../HashFunctions/StdHash.h"

#define ARGS_NUMBER 4
bool validateArgs(int argc, char* argv[]) {
    int port, bloomFilter_size, id;
    //check if 4 args was emtered
    if (argc< ARGS_NUMBER){
        return false;
    }
    try{
        //converting port num to int and check ig in range
        port = std::stoi(argv[1]);
        if (port <=0 || port >65535){
            return false;
        }
        // converting bloomFilter size to int and check that it is positive
        bloomFilter_size = std::stoi(argv[2]);
        if (bloomFilter_size <=0){
            return false;
        }
        //converting hashes to int and check if valid by creating it
        for (int i = 3; i < argc; ++i){
            id = std::stoi(argv[i]);
            if (MakeHash::createHashFunction(id) == nullptr){
                return false;
            }
        }
    }catch (...){
        return false;
    }
    return true;
}
