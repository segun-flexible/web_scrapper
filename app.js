const puppeteer = require('puppeteer')
const express = require("express");

const app = express();

app.get("/", async (req,res)=>{

	try {

		const URL = 'https://wapforum.com.ng'
		const browser = await puppeteer.launch();
		const page = await browser.newPage()

		await page.goto(URL)
		
    const data = await page.evaluate(async () => {
		const res = []

		document.querySelectorAll(".postwrap > .lightwrap h10 a").forEach(li =>{
			res.push(li.textContent)
		})

		return res
    })

	  res.json(data)

		await browser.close()

	} catch (error) {
		return res.json({message:error.message})
	}

})

app.listen(process.env.PORT || 3000, ()=>console.log("App Started"))
