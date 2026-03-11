# GOOGLE SHEET configs
The Zcash grants info is fetched from https://docs.google.com/spreadsheets/d/1FQ28rDCyRW0TiNxrm3rgD8ai2KGUsXAjPieQmI1kKKg/edit?pli=1&gid=803214474#gid=803214474. For the actions file at src/apps/actions/google-sheet.action.ts, the `Google Sheets API` needs to be enabled at `https://console.cloud.google.com/apis`.

The following environmental variables need to be set up in the `.env.local` file for local development and be configured as well on the hosting server.

The left out credentials for `GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_EMAIL` and `GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_PRIVATE_KEY` needs to be created
at `https://console.cloud.google.com/apis/credentials`

NOTE:  The below evn varaibles need to set up for the app to work and the value of no. 1, and 2 needs to be created as stated above, while that of 3, 4, and 5 can be used as is.
  
1. GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_PRIVATE_KEY=
2. GOOGLE_ZCG_SERVICE_ACCOUNT_CLIENT_EMAIL=
3. GOOGLE_ZCG_SHEET_RANGE=ZCG Grants
4. GOOGLE_ZCG_SPREADSHEET_SCOPE=https://www.googleapis.com/auth/spreadsheets.readonly
5. GOOGLE_ZCG_SPREADSHEET_ID=1FQ28rDCyRW0TiNxrm3rgD8ai2KGUsXAjPieQmI1kKKg
