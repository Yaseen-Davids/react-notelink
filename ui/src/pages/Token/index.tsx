import React, { FC, useEffect, useMemo } from "react";

import { useHistory, useRouteMatch } from "react-router-dom";

export const Token: FC<any> = () => {
  const match = useRouteMatch<any>({ path: "/token/:token" });
  const history = useHistory();

  const token: string = useMemo(() => {
    if (match) {
      return match.params.token;
    }
    return "";
  }, [match]);

  useEffect(() => {
    if (token.length > 0) {
      localStorage.setItem("login-token", token);
      history.push("/");
    }
  }, [token]);

  return (
    <div style={{ color: "#fefefe" }}>
      <p>Redirecting to app...</p>
    </div>
  );
};
