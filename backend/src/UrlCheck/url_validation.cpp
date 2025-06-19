#include "url_validation.h"

// URL validation using regular expressions
bool isValidURL(const std::string& url) {
    std::regex url_regex(R"(^((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,})(\/\S*)?$)");

    return std::regex_match(url, url_regex);
}
