export function getResetPasswordEmailForm({ name, resetUrl }) {
  return `
  <html lang="en">
    <head>
      <meta charset="utf-8" />

      <title>reset password</title>
      <meta name="description" content="Password Reset" />
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
            >Hi ${name}!</span
          >
          <span style="display:block;color:#fff;font-size:34px;font-weight:bold"
            >reset password</span
          >
        </div>
        <!--title end-->

        <!--body begin-->
        <p style="padding:10px 20px;line-height:1.5;font-size:16px">
          Click the button below to reset password.
          <br />
          <a
            href="${resetUrl}"
            style="display:inline-block;margin:10px 5px 5px 0;border-radius:7px;background-color:#22a6a7;padding:7px 15px;color:#fff;font-size:18px;text-decoration:none;text-transform:capitalize;"
            >reset password</a
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
