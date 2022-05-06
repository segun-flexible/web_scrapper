const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const { resolve } = require("path");
const app = express();

app.get("/", async (req, res) => {

	try {
		fs.readFile("cookies.json","utf-8", async (err,data)=>{
			if(err) {
				const c = await firstVisited();
				res.json(c)
			}//login
			else {
				await alreadyVisited(JSON.parse(data));
				res.json(JSON.parse(data))
			}
		})

	  } catch (error) {
		console.log(error,"freom, err");
		return res.json({ message: error.message });
	  }

  
});

app.listen(process.env.PORT || 3000, () => console.log("App Started"));


async function firstVisited(){

	return new Promise(async(resolve,reject)=>{

		try {
			
			const URL = "https://wapforum.com.ng";
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(URL,{timeout: 0});

		await page.waitForSelector(".global-header-menu__link.h-pl1")
		
		await page.evaluate(()=>{
			document.querySelectorAll(".global-header-menu__link.h-pl1")[1].click()
		})		
		
		await page.waitForSelector(".wrapper2 form [type='submit']")
	
		await page.type(".trow1 > input", "flexible")
		await page.type(".trow2 > input", "ayodeleomoalidu1")

		
		await page.evaluate(()=>{
			document.querySelector(".wrapper2 [type='submit']").click()
		})

		await page.waitForNavigation();

		const cookies = await page.cookies();
		fs.writeFileSync("cookies.json",JSON.stringify(cookies))
		await browser.close()
			resolve(cookies)
		} catch (error) {
			reject(error)
		}
	})
}

async function alreadyVisited(cookies){

	const URL = "https://wapforum.com.ng/usercp.php";
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(URL,{timeout: 0});

		await page.setCookie(...cookies)
		await page.reload();
		await browser.close()
		resolve()
}


const waitTillHTMLRendered = async (page, timeout = 30000) => {
	const checkDurationMsecs = 1000;
	const maxChecks = timeout / checkDurationMsecs;
	let lastHTMLSize = 0;
	let checkCounts = 1;
	let countStableSizeIterations = 0;
	const minStableSizeIterations = 3;
  
	while(checkCounts++ <= maxChecks){
	  let html = await page.content();
	  let currentHTMLSize = html.length; 
  
	  let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
  
	  
  
	  if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
		countStableSizeIterations++;
	  else 
		countStableSizeIterations = 0; //reset the counter
  
	  if(countStableSizeIterations >= minStableSizeIterations) {
		break;
	  }
  
	  lastHTMLSize = currentHTMLSize;
	  await page.waitForTimeout(checkDurationMsecs);
	}  
  };