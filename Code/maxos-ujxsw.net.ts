
/**
 * 文件编码: UTF-8(如不是UTF8编码可能会导致乱码或未知错误)
 * 禁止使用import、require导入模块
 * 若使用import * from *、import()、require()导入模块, 无法通过插件校验
 * import fs from 'fs';
 * import('fs').then().catch();
 * require('fs');
 */
plugin.exports = class Plugin implements BookSource {
  /**
   * 静态属性 ID  若使用插件开发工具生成模板则自动生成
   * 该值需符合正则表达式: [A-Za-z0-9_-]
   */
  public static readonly ID: string = '8s4K_SbZlemrK9LVddIHb';
  /**
   * 静态属性 TYPE  必填
   * 插件类型
   * 值类型:
   * plugin.type.BOOK_SOURCE  - 表示该插件为书源类
   * plugin.type.BOOK_STORE   - 表示该插件为书城类
   * plugin.type.TTS_ENGINE   - 表示该插件为TTS引擎类
   */
  public static readonly TYPE: number = plugin.type.BOOK_SOURCE;
  /**
   * 静态属性 GROUP  必填
   * 插件分组
   */
  public static readonly GROUP: string = '👻MaxOS';
  /**
   * 静态属性 NAME  必填
   * 插件名称
   */
  public static readonly NAME: string = '悠久小说';
  /**
   * 静态属性 VERSION  必填
   * 插件版本  用于显示
   */
  public static readonly VERSION: string = '1.0.0';
  /**
   * 静态属性 VERSION_CODE  必填
   * 插件版本代码  用于比较本地插件与静态属性PLUGIN_FILE_URL所指插件的版本号
   */
  public static readonly VERSION_CODE: number = 0;
  /**
   * 静态属性 PLUGIN_FILE_URL  必填
   * 插件http、https链接, 如: http://example.com/plugin-template.js
   */
  public static readonly PLUGIN_FILE_URL: string = 'https://raw.kkgithub.com/Maxthos/ReadCat-BookSource/main/Plugin/maxos-ujxsw.net.ts.js';
  /**
   * 静态属性 BASE_URL  书源、书城类必填
   * 插件请求目标链接
   */
  public static readonly BASE_URL: string = 'http://www.ujxsw.net';
  /**
   * 静态属性 REQUIRE  可选
   * 要求用户填写的值
   */
  public static readonly REQUIRE: Record<string, RequireItem> = {};
  /**
   * 书源类搜索结果过滤器  可选
   */
  public static readonly SEARCH_FILTER: SearchFilter = void 0;
  /**
   * 插件是否启用，为true表示该插件已弃用  可选
   */
  public static readonly DEPRECATED: boolean | undefined = void 0;
  private request: ReadCatRequest;
  private store: Store;
  private cheerio: CheerioModule.load;
  private nanoid: () => string;
  private uuid: (noDash?: boolean) => string;
  constructor(options: PluginConstructorOptions) {
    const { request, store, cheerio, nanoid, uuid } = options;
    /**
     * request
     *   function get(url, config)
     *     url: string    请求链接
     *     config(可选): {
     *                     params(可选): { [key: string]: number | string | boolean } | URLSearchParams,    请求参数
     *                     headers(可选): { [key: string]: string },    请求头
     *                     proxy(可选): boolean    是否开启代理,
     *                     charset(可选): string    字符集, 默认为自动获取, 当出现乱码时请指定字符集
     *                     urlencode(可选): string   URL编码, 默认UTF8
     *                     maxRedirects(可选): number  最大重定向数, 为0时则禁止重定向
     *                     responseType(可选): 'arraybuffer' | 'text' | 'json'  响应体类型, 默认text
     *                     signal(可选): AbortSignal  中止信号
     *                   }
     *   return: Promise<{ body, code, headers }>
     *   function post(url, config)
     *     url: string    请求链接
     *     config(可选): {
     *                     params(可选): { [key: string]: number | string | boolean }, | URLSearchParams,    请求参数
     *                     headers(可选): { [key: string]: string },    请求头
     *                     proxy(可选): boolean    是否开启代理
     *                     charset(可选): string    字符集, 默认为自动获取, 当出现乱码时请指定字符集
     *                     urlencode(可选): string   URL编码, 默认UTF8
     *                     maxRedirects(可选): number  最大重定向数, 为0时则禁止重定向
     *                     responseType(可选): 'arraybuffer' | 'text' | 'json'  响应体类型, 默认text
     *                     signal(可选): AbortSignal  中止信号
     *                   }
     *   return: Promise<{ body, code, headers }>
     * 
     *   body: 响应体
     *   code: 响应码
     *   headers: 响应头
     */
    this.request = request;
    /**
     * 每个插件都自带仓库（最大存储4MB）, 您可向该仓库设置、获取、删除值
     * store
     *   function setStoreValue(key, value)
     *               key: string,
     *               value: any (JavaScript基本数据类型), 该值经过v8.serialize处理
     *   return Promise<void>
     *   function getStoreValue(key)
     *               key: string
     *   return Promise<any | null> (JavaScript基本数据类型)
     *   function removeStoreValue(key)
     *               key: string
     *   return Promise<void>
     */
    this.store = store;
    /**
     * function cheerio(html: string)
     * 该值是模块cheerio中的load方法, 用法 const $ = cheerio(HTMLString)
     * 文档: https://cheerio.nodejs.cn/docs/basics/loading#load
     */
    this.cheerio = cheerio;
    /**
     * function nanoid
     * 获取21位随机字符串
     */
    this.nanoid = nanoid;

    this.uuid = uuid;
  }

  
  async search(searchkey: string): Promise<SearchEntity[]> {
    /*
      控制台日志打印(仅支持log、info、error、warn、debug方法)
      https://zhongtianwen.cn/xiaoshuosousuo/jieguo.html?searchkey=完美世界
    */
    console.log(searchkey);
    const { body } = await this.request.post(`${Plugin.BASE_URL}/searchbooks.php`, {
      params: {
        searchkey
      }
    });
    const $ = this.cheerio(body);
    const results: SearchEntity[] = [];
    const uls = $('div.shulist > ul');
    console.log(uls.length);
    for (const ul of uls) {
      const lis = $(ul).find('li');
      const a = $(lis.get(2)).find('a');
      // console.log($(a.get(0)).attr('href'));
	    const match = $(a.get(0)).attr('href').match(/\/book\/(\d+)/);
      //console.log($(a.get(0)).attr('href').match(/\/book\/(\d+)/)[1])
	    const bid = match[1];
      console.log(bid);
	    // const fid = Math.floor(parseInt(match[1], 10) / 1000);
      const fid = bid.slice(0, -3) || "0";
      console.log(fid);
      results.push({
        bookname: $(a.get(0)).text(),
        author: $(lis.get(3)).find('a').text(),
		    coverImageUrl: `${Plugin.BASE_URL}/files/article/image/${fid}/${bid}/${bid}s.jpg`,
        detailPageUrl: Plugin.BASE_URL + $(a.get(0)).attr('href'),
        latestChapterTitle: $(a.get(1)).text()
      });
    }
    return results;
  }

  async getDetail(detailPageUrl: string): Promise<DetailEntity> {
    const { body } = await this.request.get(detailPageUrl);
    let $ = this.cheerio(body);
    const coverImageUrl = $('#bookimg > a.img > img').attr('src');
    const em = $('div.d_title > h1 > em');
    const bookname = $('div.d_title > h1').text().replace(em.text().trim(), '');
    const author = em.children('a').text();
    const intro = $('#bookintro').text();
    const latestChapterTitle = $('span.new_t > a').text();

    const chapterUrl = Plugin.BASE_URL + $('div.motion > a:nth-child(1)').attr('href');
    const { body: body2 } = await this.request.get(chapterUrl);
    $ = this.cheerio(body2);
    const chapterList = [];
    const clis = $('#readerlist > ul > li');
    for (let i = 0; i < clis.length; i++) {
      const cli = $(clis.get(i));
      if (cli.hasClass('fj')) {
        continue;
      }
      const a = cli.find('a');
      const title = a.text();
      const url = Plugin.BASE_URL + a.attr('href');
      chapterList.push({
        title,
        url
      });
    }
    return {
      bookname,
      author,
      coverImageUrl,
      latestChapterTitle,
      intro,
      chapterList
    }
  }

  async getTextContent(chapter: Chapter): Promise<string[]> {
    const { body } = await this.request.get(chapter.url);
    const $ = this.cheerio(body);
    const reg1 = /【悠久小.*?免费阅读！|纯文字在线阅.*?请访问|最快.*?阅读请。|佰度搜索.*?免费下载！|悠久小说网.*?\..*?\..*?|Ｘ２３ＵＳ．ＣＯＭ更新最快/i;
    const reg2 = /\/p$/i;

    return $('div.read-content > p').html().split('<br>').map(v => {
      v = v.replaceAll('&nbsp;', '').trim();
      if (reg1.test(v) || reg2.test(v)) {
        return '';
      }
      if (reg2.test(v)) {
        v = v.replace('/p', '');
      }
      return v.replace(reg1, '').trim();
    }).filter(v => v !== '');
   }
}
