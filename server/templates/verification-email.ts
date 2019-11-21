export function getVerificationEmailForm({ name, verifyUrl }) {
  return `
  <html lang="en">
    <head>
      <meta charset="utf-8" />

      <title>Verify your email</title>
      <meta name="description" content="Verify your email" />
      <meta name="author" content="hatiolab" />
    </head>

    <body>
      <div style="width:650px;border:1px solid #ccc;background-color:#f6f6f6">
        <!--header begin-->
        <div style="background-color:#fff;padding:5px 10px">
          <a href="#" target="_blank"
            ><img
              src="http://www.hatiolab.com/assets/img/logo-operato.png"
              style="max-height:50px"
          /></a>
        </div>
        <!--header end-->

        <!--title begin-->
        <div
          style="background-color:#22a6a7;padding:12px 10px 10px 10px;min-height:50px;"
        >
          <img
            src="http://www.hatiolab.com/assets/img/icon-mail.png"
            style="float:left;margin:0 10px 0 40px"
          />
          <span style="display:block;color:#fff;font-size:20px"
            >Hey ${name}!</span
          >
          <span style="display:block;color:#fff;font-size:34px;font-weight:bold"
            >Verify Your Email Address.</span
          >
        </div>
        <!--title end-->

        <!--body begin-->
        <p style="padding:10px 20px;line-height:1.5;font-size:16px">
          Your GitHub account was successfully signed in to but we did not
          recognize the location of the sign in. You can review this sign in
          attempt by visiting
          https://github.com/settings/sessions/authentications/294834505. If you
          recently signed in to your account, you do not need to take any further
          action. If you did not sign in to your account, your password may be
          compromised. Visit https://github.com/settings/admin to create a new,
          strong password for your GitHub account. For more information, see
          "https://help.github.com/articles/keeping-your-account-and-data-secure/"
          in the GitHub Help. To see this and other security events for your
          account, visit https://github.com/settings/security<br />
          <a
            href="${verifyUrl}"
            style="display:inline-block;margin:10px 5px 5px 0;border-radius:7px;background-color:#22a6a7;padding:7px 15px;color:#fff;font-size:18px;text-decoration:none;text-transform:capitalize;"
            >Verify</a
          >
        </p>
        <!--body end-->

        <!--footer begin-->
        <div
          style="background-color:#3d5874;padding:7px 20px 5px 20px;font-size:12px;color:#efefef"
        >
          © Hatio, Lab. Inc. All rights reserved.
        </div>
        <!--footer end-->
      </div>
    </body>
  </html>
  `
}
