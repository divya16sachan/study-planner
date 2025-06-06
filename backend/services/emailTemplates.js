export const otpTemplate = (email, otpCode, expiresInMinutes) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style type="text/css">
        /* Client-specific resets */
        body, html {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f5f5f5 !important;
        }
        /* Main container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            width: 100%;
        }
        /* Header */
        .header {
            background-color: #448aff !important;
            padding: 20px !important;
            text-align: center !important;
        }
        /* Content */
        .content {
            padding: 30px !important;
            background-color: #ffffff !important;
        }
        /* Footer */
        .footer {
            padding: 20px !important;
            text-align: center !important;
            font-size: 12px !important;
            color: #676e86 !important;
            background-color: #ffffff !important;
        }
        /* Social icons */
        .social-icons {
            margin: 15px 0 !important;
            text-align: center !important;
            font-size: 0 !important;
        }
        .social-icon-wrapper {
            display: inline-block !important;
            margin: 0 8px !important;
        }
        .social-icon {
            width: 24px !important;
            height: 24px !important;
            opacity: 0.8 !important;
            filter: grayscale(100%) !important;
            vertical-align: middle !important;
        }
        /* Brand section */
        .brand-section {
            margin-bottom: 20px !important;
        }
        .brand-divider {
            height: 1px !important;
            background-color: #cfd8dc !important;
            margin: 15px 0 !important;
        }
        /* OTP box */
        .otp-container {
            background: #f8f9fa !important;
            padding: 20px !important;
            text-align: center !important;
            margin: 25px 0 !important;
            border-radius: 8px !important;
            border: 1px solid #e0e0e0 !important;
        }
        .otp-code {
            font-size: 32px !important;
            font-weight: bold !important;
            letter-spacing: 5px !important;
            color: #448aff !important;
            margin: 15px 0 !important;
        }
        .muted-text {
            font-size: 13px !important;
            color: #676e86 !important;
            line-height: 1.5 !important;
        }
        .email-address {
            color: #448aff !important;
            font-weight: 500 !important;
        }
        /* Responsive */
        @media screen and (max-width: 600px) {
            .content {
                padding: 20px 15px !important;
            }
            .otp-container {
                margin: 20px 0 !important;
                padding: 15px !important;
            }
            .otp-code {
                font-size: 28px !important;
                letter-spacing: 3px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; font-family: Arial, sans-serif; line-height: 1.6; background-color: #f5f5f5;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; width: 100%;">
        <!-- Header Section -->
        <div class="header" style="background-color: #448aff; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Study Planner</h1>
        </div>
        
        <!-- Content Section -->
        <div class="content" style="padding: 30px; background-color: #ffffff;">
            <div class="brand-section" style="margin-bottom: 20px;">
                <h2 style="margin: 0 0 10px 0; font-size: 18px;">Hello, <span class="email-address" style="color: #448aff; font-weight: 500;">${email}</span></h2>
                <div class="brand-divider" style="height: 1px; background-color: #cfd8dc; margin: 15px 0;"></div>
            </div>
            
            <p style="margin-bottom: 25px;">To continue setting up your StudyPlanner account, please verify your account with the code below:</p>
            
            <!-- OTP Box -->
            <div class="otp-container" style="background: #f8f9fa; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; border: 1px solid #e0e0e0;">
                <div class="otp-code" style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #448aff; margin: 15px 0;">${otpCode.toString().replace(/(\d{3})(\d{3})/, '$1 $2')}</div>
                <p class="muted-text" style="font-size: 13px; color: #676e86; line-height: 1.5;">This code will expire in ${expiresInMinutes}.</p>
                <p class="muted-text" style="font-size: 13px; color: #676e86; line-height: 1.5;">Please do not disclose this code to others.</p>
            </div>
            
            <p class="muted-text" style="font-size: 13px; color: #676e86; line-height: 1.5; margin-top: 25px;">If you did not make this request, please disregard this email.</p>
        </div>
        
        <!-- Footer Section -->
        <div class="footer" style="padding: 20px; text-align: center; font-size: 12px; color: #676e86; background-color: #ffffff;">
            <div class="social-icons" style="margin: 15px 0; text-align: center; font-size: 0;">
                <span class="social-icon-wrapper" style="display: inline-block; margin: 0 8px;">
                    <a href="https://www.linkedin.com/in/divyasachan/" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" class="social-icon" style="width: 24px; height: 24px; opacity: 0.8; filter: grayscale(100%); vertical-align: middle;">
                    </a>
                </span>
                <span class="social-icon-wrapper" style="display: inline-block; margin: 0 8px;">
                    <a href="https://github.com/divya16sachan" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" class="social-icon" style="width: 24px; height: 24px; opacity: 0.8; filter: grayscale(100%); vertical-align: middle;">
                    </a>
                </span>
                <span class="social-icon-wrapper" style="display: inline-block; margin: 0 8px;">
                    <a href="https://www.instagram.com/divya16sachan" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" class="social-icon" style="width: 24px; height: 24px; opacity: 0.8; filter: grayscale(100%); vertical-align: middle;">
                    </a>
                </span>
            </div>
            <p style="margin: 0;">© 2024 Study Planner. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};