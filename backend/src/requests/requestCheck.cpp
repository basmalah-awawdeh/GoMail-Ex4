#include "requestCheck.h"
#include "../UrlCheck/url_validation.h"


std::string requestCheck(const std::string& request,
                           BlacklistURL& blacklist,
                           BlacklistFileManager& manager,
                           BloomFilterFileManager& bloomFileManager) {
    std::istringstream iss(request);
    std::string client_request, url;
    iss >> client_request >> url;

    std::ostringstream response;
//client's request is POST ==> add url after checking that it is valid and not found in the blacklist
if (client_request == "POST") {
    if (!url.empty() && isValidURL(url)) {
        if (!blacklist.isBlacklisted(url)) {
            blacklist.addURL(url);
            manager.save(blacklist);
            bloomFileManager.save(blacklist);
            response << "201 Created\n";
        } else {
            //url already found
            response << "200 Ok\n"; 
        }
    } else {
        //invalid url
        response << "400 Bad Request\n";
    }
    //client's request is GET ==> check if url is blacklisted and falsepositive chekc
}else if (client_request == "GET") {
        if (blacklist.isBlacklisted(url)) {
            bool actual = blacklist.isFalsePositive(url);
            response << "200 Ok\n\n" << (actual ? "true true" : "true false") << "\n";
        } else {
            response << "200 Ok\n\nfalse\n";
        }
        // client's request is DELETE ==> remove the url from the blacklist
    } else if (client_request == "DELETE") {
        if (blacklist.removeURL(url)) {
            manager.save(blacklist);
            bloomFileManager.save(blacklist);
            response << "204 No Content\n";
        } else {
            response << "404 Not Found\n";
        }
    } else {
        // client request is invalid
        response << "400 Bad Request\n";
    }

    return response.str();
}
