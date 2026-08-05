const template = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>

<body
    style="margin:0;padding:40px 20px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">

                <table role="presentation" cellpadding="0" cellspacing="0" width="650"
                    style="max-width:650px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.12);">

                    <!-- Header -->
                    <tr>
                        <td align="center"
                            style="background:#2563eb;padding:35px 30px;">

                            <h1
                                style="margin:0;font-size:34px;font-weight:bold;color:#ffffff;letter-spacing:.5px;">
                                WebOrbit
                            </h1>

                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:50px;">

                            <h2
                                style="margin:0 0 20px;font-size:30px;color:#111827;">
                                Verify Your Email
                            </h2>

                            <p
                                style="margin:0 0 25px;font-size:19px;line-height:1.8;color:#4b5563;">
                                Hello,
                            </p>

                            <p
                                style="margin:0 0 35px;font-size:19px;line-height:1.8;color:#4b5563;">
                                Thank you for signing up with
                                <strong>WebOrbit</strong>.
                                Please use the verification code below to complete
                                your email verification.
                            </p>

                            <!-- OTP -->

                            <table role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                width="100%">

                                <tr>

                                    <td align="center">

                                        <div
                                            style="
                                                display:inline-block;
                                                background:#eff6ff;
                                                border:2px dashed #2563eb;
                                                border-radius:12px;
                                                padding:24px 55px;
                                                font-size:48px;
                                                font-weight:bold;
                                                letter-spacing:12px;
                                                color:#2563eb;
                                            ">
                                            {{OTP}}
                                        </div>

                                    </td>

                                </tr>

                            </table>

                            <p
                                style="margin:40px 0 15px;font-size:18px;line-height:1.8;color:#374151;">
                                This OTP is valid for
                                <strong>4 minutes</strong>.
                            </p>

                            <p
                                style="margin:0;font-size:18px;line-height:1.8;color:#374151;">
                                Never share this OTP with anyone.
                                WebOrbit will never ask for your verification code.
                            </p>

                        </td>
                    </tr>

                    <!-- Divider -->

                    <tr>

                        <td>

                            <hr
                                style="border:none;border-top:1px solid #e5e7eb;margin:0;">

                        </td>

                    </tr>

                    <!-- Footer -->

                    <tr>

                        <td
                            align="center"
                            style="padding:35px;">

                            <p
                                style="margin:0 0 12px;font-size:16px;color:#6b7280;">
                                If you didn't request this email,
                                you can safely ignore it.
                            </p>

                            <p
                                style="margin:0;font-size:15px;color:#9ca3af;">
                                © 2026 WebOrbit. All Rights Reserved.
                            </p>

                        </td>

                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>`
export default template