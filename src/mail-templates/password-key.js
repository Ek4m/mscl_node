module.exports = function (rawToken) {
  return `<div style="margin:0;padding:0;font-family:Arial,sans-serif; background: #3b3b3b; ">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="360" cellpadding="0" cellspacing="0" style="background:#121212;border-radius:12px;padding:20px;color:#fff;text-align:center;">
          
          <!-- TITLE -->
          <tr>
            <td>
              <div style="font-size:10px;letter-spacing:2px;color:#06b6d4;font-weight:bold;margin-bottom:6px;">
                SECURITY VERIFICATION
              </div>
              <div style="font-size:20px;font-weight:900;font-style:italic;">
                RESET YOUR PASSWORD
              </div>
            </td>
          </tr>

          <!-- MESSAGE -->
          <tr>
            <td style="padding-top:15px;">
              <div style="color:#aaa;font-size:12px;">
                Use the code below to reset your password
              </div>
            </td>
          </tr>

          <!-- TOKEN BOX -->
          <tr>
            <td style="padding-top:20px;">
              <div style="background:#0d0d0d;border:1px solid #06b6d4;border-radius:10px;padding:16px;">
                <div style="font-size:26px;font-weight:900;letter-spacing:4px;color:#06b6d4;">
                  ${rawToken}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-top:15px;">
              <div style="color:#666;font-size:10px;">
                This code expires in 5 minutes
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-top:20px;font-size:10px;color:#555;">
              If you didn’t request this, ignore this email
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>`;
};
