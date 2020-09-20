vcl 4.1;

backend josecarlos_me {
    .host = "josecarlos-me";
    .port = "80";
}

sub vcl_recv {
    if (req.http.host ~ "josecarlos.me") {
        set req.backend_hint = josecarlos_me;
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

    if (req.method != "GET" && req.method != "HEAD") {
      return (pass);
    }

    return (hash);
}

sub vcl_backend_response {
  if (beresp.status == 200) {
    unset beresp.http.Cache-Control;
    set beresp.http.Cache-Control = "public; max-age=720";
    set beresp.ttl = 720s;
  }
}

sub vcl_deliver {
  if (obj.hits > 0) { # Add debug header to see if it's a HIT/MISS and the number of hits, disable when not needed
    set resp.http.X-Cache = "HIT";
  } else {
    set resp.http.X-Cache = "MISS";
  }
}