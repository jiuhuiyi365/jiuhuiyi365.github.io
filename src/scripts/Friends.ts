
import vh from 'vh-plugin';
import { fmtDate } from '@/utils/index'
import { $GET } from '@/utils/index'
// 图片懒加载
import vhLzImgInit from "@/scripts/vhLazyImg";

const FriendsInit = async (data: any) => {
	const friendsDOM = document.querySelector('.main-inner-content>.vh-tools-main>main.friends-main')
	if (!friendsDOM) return;
	try {
		let res = data;
		if (typeof data === 'string') {
			res = await $GET(api);
		}
		friendsDOM.innerHTML = res.map((i: any) => {
			const blogUrl = i.blogLink || (i.link ? 'https://' + i.link.split('//')[1].split('/')[0] : '#');
			const avatarSrc = i.avatar || (i.link ? `https://icon.bqb.cool/?url=${i.link.split('//')[1].split('/')[0]}` : '');
			return `<article><a href="${blogUrl}" target="_blank" rel="noopener nofollow" class="friend-avatar-link"><img src="${avatarSrc}" alt="${i.auther}" /></a><div class="friend-content"><a href="${i.link}" target="_blank" rel="noopener nofollow" class="friend-article-link"><header><h2>${i.title}</h2></header><p class="vh-ellipsis line-2">${i.content}</p></a><footer><a href="${blogUrl}" target="_blank" rel="noopener nofollow" class="friend-name-link"><span><em class="vh-ellipsis">${i.auther}</em></span></a><time>${fmtDate(i.date, false)}前</time></footer></div></article>`;
		}).join('');
		// 图片懒加载
		vhLzImgInit();
	} catch {
		vh.Toast('获取数据失败')
	}
}

// 朋友圈 RSS 初始化
import FRIENDS_DATA from "@/page_data/Friends";
const { api, data } = FRIENDS_DATA;
export default () => FriendsInit(api || data);