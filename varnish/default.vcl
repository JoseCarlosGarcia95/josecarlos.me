vcl 4.1;

backend josecarlos_me {
    .host = "josecarlos-me";
    .port = "80";
}

backend blog_josecarlos_me {
    .host = "blog-josecarlos-me";
    .port = "2368";
}

sub vcl_recv {
    if (req.http.host == "josecarlos.me") {
        if (req.url ~ "^/blog") {
          set req.backend_hint = blog_josecarlos_me;
        } else {
          set req.backend_hint = josecarlos_me;
        }
    }

    if (req.method != "GET" &&
      req.method != "HEAD" &&
      req.method != "PUT" &&
      req.method != "POST" &&
      req.method != "TRACE" &&
      req.method != "OPTIONS" &&
      req.method != "DELETE") {
        return (pipe);
    }

    if (req.url ~ "/clearcache/ieTheiquoovaexairibig2eyooj0UxaiM3ahshahwukie5Eifaok4shooFooshaev3feeD7aipooG7iNuquoh3kohhareedierai") {
      # Same ACL check as above:
      ban("req.url ~ ^/blog");

      return(synth(200, "Cache cleared"));
    }

    if (req.method != "GET" && req.method != "HEAD") {
      return (pass);
    }

    if (req.http.Cookie ~ "ghost-admin-api-session") {
      return (pass);
    }

    return (hash);
}

sub vcl_backend_response {
  if (beresp.status == 200) {
    unset beresp.http.Cache-Control;
    set beresp.http.Cache-Control = "public; max-age=86400";
    set beresp.ttl = 86400s;
  }
}

sub vcl_deliver {
  if (obj.hits > 0) { 
    set resp.http.X-Cache = "HIT";
  } else {
    set resp.http.X-Cache = "MISS";
  }
}