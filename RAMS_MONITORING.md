## **RAMS MONITORING**

*Frontend (Dashboard) tech:
React.js (via vite)
Tailwind CSS
React-Leaflet
Custom Dijkstra's Algorithm implementation (rerouting decision)*



======================================================================================================

##### =    PARA SA SEAMLESS TRANSFER NG CODEBASE, FOLLOW NYO LANG I2     =

======================================================================================================



###### **STEP 1. Download nyo to**

* Go to nodejs.org and download the LTS (Long Term Support) version. This installs both Node.js (the runtime) and npm (the Node Package Manager used to install your dependencies).
* if wala pang Git sa pc nyo, go to git-scm.org tapos download nyo lang yung git



###### STEP 2. \*\*IMPORTANT PART\*\* Clone the GitHub repository to your local device

**FOLLOW NYO LANG TONG STEPS:**

1. Open VS Code, then open a terminal
2. type this command and hit enter: ***git config --global user.name "lagay nyo dito sa loob ng quotation marks yung name na gusto nyo (usually developer name)"***
3. type this command and hit enter: ***git config --global user.email "rams.monitoring01@gmailcom"***
4. CLONING ON THE REPOSITORY

   1. Prepare a folder in you computer, Kahit sa desktop then navigate to that folder using your VS COde Terminal. gamit kayo ng cd command
   2. Sa terminal ng VS Code, type nyo lang to then enter: ***git clone https://github.com/ramsmonitoring01-BulSU/RAMS.git***
   3. once successfully cloned, balik kayo sa VS COde then open nyo yung folder nung project
   4. sa root folder (or main folder, same level nung src folder) create a file tapos rename nyo sya as ***.env*** yan lang mismo then paste this code inside the file

      * VITE\_SUPABASE\_URL=https://qmjhunyvzqdbyyiueevj.supabase.co
      * VITE\_SUPABASE\_ANON\_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtamh1bnl2enFkYnl5aXVlZXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0OTM3MTgsImV4cCI6MjEwMDA2OTcxOH0.ldcv-riWzBXpv1FN11nq5wRGkqKX3zBKr7ue02Qe\_qg

5\. After nyo maclone repository, open your terminal ulit sa vscode and run this command: ***npm install***

6\. Kung nasundan nyo lhat ng steps, you should be able to run this command without issues: ***npm run dev***



======================================================================================================



#### **GMAIL**

**ACCOUNT:** rams.monitoring01@gmail.com

**PASSWORD:** admin.admin1234





#### **Google Apps Script**

**DEPLOYMENT ID:** AKfycbybrsz62YwmYyj8y7MeVBMB5DcXyCJOdf9\_5Of91NPg3nELZhRK3\_dpgXi01XIyYFVr

**WEB URL:** https://script.google.com/macros/s/AKfycbybrsz62YwmYyj8y7MeVBMB5DcXyCJOdf9\_5Of91NPg3nELZhRK3\_dpgXi01XIyYFVr/exec



======================================================================================================



#### **GITHUB >> RAMS**

###### ***(for version control and easier updating of code)***

*\*\*Login using gmail\*\**

**>> git pull *(use this command to get the latest version of the code form the GitHub repository, sa terminal ng IDE nyo, connect nyo muna yung GitHub then try nyo iclone yung repository)***



======================================================================================================



##### **DATABASE (SUPABASE)**

**ACCOUNT:** rams.monitoring01@gmail.com

**PASSWORD:** Admin.admin1234

*^^Case sensitive ata to*



Project Parameters:

**PORJECT URL:**

https://qmjhunyvzqdbyyiueevj.supabase.co



**PROJECT URL FOR ESP32 INTEGRATION:**

https://qmjhunyvzqdbyyiueevj.supabase.co/rest/v1/gate\_telemetry

*\*\*ito yung gagamitin nyo to post the sensor data from esp32 to database\*\**



*\*\*Parang ganto yung code nyo\*\**

*const String supabase\_url = "https://qmjhunyvzqdbyyiueevj.supabase.co/rest/v1/gate\_telemetry";*

*const String supabase\_key = "YOUR\_SUPABASE\_ANON\_PUBLIC\_KEY";*



##### **IMPORTANT KEYS (DO NOT SHARE)**



**ANON PUBLIC:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtamh1bnl2enFkYnl5aXVlZXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0OTM3MTgsImV4cCI6MjEwMDA2OTcxOH0.ldcv-riWzBXpv1FN11nq5wRGkqKX3zBKr7ue02Qe\_qg



**SERVICE ROLE (SECRET):**

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtamh1bnl2enFkYnl5aXVlZXZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDQ5MzcxOCwiZXhwIjoyMTAwMDY5NzE4fQ.hbTMwm60w27STPH5fHkDD0HZUYzp0SrkJwientfWiKE



##### **TABLE RESET**

**Pag ready na kayo for real data push, clear nyo muna yung current table para fresh start**



**// Ito yung SQL command**



**TRUNCATE TABLE gate\_telemetry RESTART IDENTITY;**



1. Log in to your Supabase Dashboard and select your project.
2. On the left-hand navigation menu, click on the SQL Editor (it looks like a </> icon).
3. Click the New Query button.
4. Paste the SQL command above into the empty editor block.
5. Click the green Run button in the bottom right corner.



======================================================================================================



#### **CLOUDFLARE**

*\*\*Login using gmail\*\**

* For free hosting - cloudflare pages (rams-bulsu.pages.dev)
* Constantly monitors yung changes sa GitHub repository and updates the dashboard

