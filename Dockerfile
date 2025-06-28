FROM gcc:latest
WORKDIR /app
COPY . .

RUN g++ -std=c++17 \
    backend/src/server/server_main.cpp \
    backend/src/FileManager/BlacklistFileManager.cpp \
    backend/src/FileManager/BloomFilterFileManager.cpp \
    backend/src/BloomFilter/BloomFilter.cpp \
    backend/src/UrlCheck/url_blacklist.cpp \
    backend/src/UrlCheck/url_validation.cpp \
    backend/src/HashFunctions/HashFunctionFactory.cpp \
    backend/src/HashFunctions/StdHash.cpp \
    backend/src/HashFunctions/DoubleHash.cpp \
    backend/src/requests/requestCheck.cpp \
    -o server -pthread

CMD ["./server", "12345", "8", "1", "2"]
