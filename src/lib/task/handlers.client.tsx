"use client";

import { type FC, useEffect } from "react";

export const SetCookieComponent: FC<{
  cookiePath: string;
  cookieName: string;
  flag: string;
}> = (props) => {
  useEffect(() => {
    const cookie = `${props.cookieName}=${props.flag}; path=${props.cookiePath}`;

    if (!document) {
      return;
    }

    document.cookie = cookie;
  }, [props.cookieName, props.cookiePath, props.flag]);

  return <>{null}</>;
};
