import { NextResponse, NextRequest } from "next/server";
import { decrypt, encrypt, getAuthorFirst } from "./lib/utils";
import { auth } from "@/lib/auth";

export default auth(async (req) => {
  const res = NextResponse.next();
  const { headers, cookies } = req;
  const secret = process.env.COOKIE_SECRET;

  const isSecure = req.secure || req.headers.get('x-forwarded-proto') === 'https';

  try {

    if (req.auth) {
      async function setCreator(res) {
        let creator = (await req.auth?.user?.creators?.length) > 0 ? await req.auth?.user?.creators[0].key : null;
        if (creator) {
          creator = encrypt(creator, secret);
          res.cookies.set({
            name: "__Secure-RSUAUD",
            value: creator,
            httpOnly: false,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 365 * 24 * 60 * 60,
          });
        }
      }

      if (!cookies.has("__Secure-RSUAUD")) {
        await setCreator(res);
      } else {
        let aud = await cookies.get("__Secure-RSUAUD");
        aud = decrypt(aud.value, secret);
        if (!aud) {
          await setCreator(res);
        }
      }

    }
    return res;
  } catch (error) {
    console.error('The Middleware error :', error);
    return res;
  }

})