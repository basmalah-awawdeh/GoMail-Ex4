cmake_minimum_required(VERSION 3.10)
project(GoMail)

include_directories(
    ${CMAKE_SOURCE_DIR}/src
    ${CMAKE_SOURCE_DIR}/src/BloomFilter
    ${CMAKE_SOURCE_DIR}/src/CLI
    ${CMAKE_SOURCE_DIR}/src/FileManager
    ${CMAKE_SOURCE_DIR}/src/HashFunctions
    ${CMAKE_SOURCE_DIR}/src/UrlCheck
)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# build static library with common logic
add_library(gomail_lib STATIC
    src/BloomFilter/BloomFilter.cpp
    src/CLI/CLI.cpp
    src/FileManager/BlacklistFileManager.cpp
    src/FileManager/BloomFilterFileManager.cpp
    src/HashFunctions/DoubleHash.cpp
    src/HashFunctions/HashFunctionFactory.cpp
    src/HashFunctions/StdHash.cpp
    src/UrlCheck/url_blacklist.cpp
    src/UrlCheck/url_validation.cpp
    src/requests/requestCheck.cpp
)

target_include_directories(gomail_lib
    PUBLIC
        ${CMAKE_SOURCE_DIR}/src
)

# executable TCP server
add_executable(server
    src/server/server_main.cpp
)
target_link_libraries(server PRIVATE gomail_lib)


# option for the tests
if(EXISTS ${CMAKE_SOURCE_DIR}/src/Tests)
    enable_testing()
    include(FetchContent)
    FetchContent_Declare(
        googletest
        GIT_REPOSITORY https://github.com/google/googletest.git
        GIT_TAG release-1.12.1
    )
    FetchContent_MakeAvailable(googletest)
    add_executable(tests
        src/Tests/server_command_test.cpp 
    )
    target_link_libraries(tests PRIVATE gtest_main gomail_lib)
    include(GoogleTest)
    gtest_discover_tests(tests)
endif()