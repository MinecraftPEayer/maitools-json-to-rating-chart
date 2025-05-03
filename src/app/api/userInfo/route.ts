import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from 'jsdom';
import cookieParser, { Cookie } from 'set-cookie-parser';

class MaimaiDXNetFetcher {
    cookies: Cookie[] = [];
    loginFinished: boolean = false;

    constructor() {
        this.login()
            .then(() => {
                console.log('Logged in successfully');
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                this.login()
            }
        );
    }

    async login(): Promise<void> {
        this.cookies = [];

        let jsessionIdResponse = await fetch('https://lng-tgk-aime-gw.am-all.net/common_auth/login?site_id=maimaidxex&redirect_url=https://maimaidx-eng.com/maimai-mobile/&back_url=https://maimai.sega.com/', {
            method: 'GET',
        })
        let cookies = jsessionIdResponse.headers.get('set-cookie')
    
        try {
            let loginResponse = await fetch('https://lng-tgk-aime-gw.am-all.net/common_auth/login/sid/', {
                method: 'POST',
                headers: {
                    ...(cookies ? { 'Cookie': cookies } : {}),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0 Safari/537.36',
                },
                body: new URLSearchParams({
                    'sid': process.env.SID ?? '',
                    'password': process.env.SID_PASSWORD ?? '',
                    'retention': '1'
                }),
                redirect: 'manual'
            });
    
            let dxNetResponse = await fetch(loginResponse.headers.get('Location') ?? '', {
                method: 'GET',
                headers: {
                    ...(cookies ? { 'Cookie': cookies } : {}),
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0 Safari/537.36',
                },
                redirect: 'manual'
            })

            let dxNetCookies = dxNetResponse.headers.get('set-cookie')
            if (dxNetCookies) {
                let parsing = cookieParser.splitCookiesString(dxNetCookies)
                this.cookies?.push(...cookieParser.parse(parsing))
            }
            this.loginFinished = true;
        } catch (error) {
            Promise.reject("Error fetching user info");
        }
    }

    async getUserInfo(friendCode: string): Promise<any> {
        if (!this.loginFinished) {
            return {
                error: 'Login not finished'
            }
        }

        if (!this.cookies) {
            await this.login();
        }

        let userInfoResponse = await fetch(`https://maimaidx-eng.com/maimai-mobile/friend/search/searchUser/?friendCode=${friendCode}`, {
            method: 'GET',
            headers: {
                ...(this.cookies ? { 'Cookie': this.cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ') } : {}),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0 Safari/537.36',
            }
        })
        let resText = await userInfoResponse.text()

        if (resText.includes('maimai DX NET－Error－')) {
            await this.login();
            return await this.getUserInfo(friendCode);
        }

        let dom = new JSDOM(resText, { contentType: 'text/html' })

        if (!dom.window.document.querySelector('.name_block') || !dom.window.document.querySelector('.basic_block img')) {
            return {
                error: 'User not found'
            }
        }

        return {
            avatar: dom.window.document.querySelector('.basic_block img')?.getAttribute('src'),
            name: dom.window.document.querySelector('.name_block')?.textContent,
        }
    }
}

const fetcher = new MaimaiDXNetFetcher();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const friendCode = searchParams.get('friendCode');

        if (!friendCode) {
            return NextResponse.json({ error: 'No friend code provided' }, { status: 400 });
        }

        const userInfo = await fetcher.getUserInfo(friendCode);

        return NextResponse.json(userInfo);
    } catch (error) {
        
    }
}