# UK Christmas posting dates widget (Royal Mail 2026)

A free, copy-and-paste countdown to Royal Mail's last Christmas posting dates for UK shop websites. It can also show **your own order-by dates** if you need a working day or two to pack orders.

**Live demo and code generator:** https://www.tchworks.co.uk/uk-christmas-posting-dates/

- One 6 KB file, no libraries, no cookies, no tracking, no outside requests
- Works on WordPress, Shopify, Squarespace, Wix and plain HTML
- Counts back working days (Monday to Friday) for your packing time
- Turns red in the last 3 days and says when a date has passed
- MIT licence

## Paste this into your site

```html
<div data-uk-posting-dates data-dispatch="1"></div>
<script src="https://www.tchworks.co.uk/uk-christmas-posting-dates/posting-dates.js" defer></script>
```

Using the hosted file means your widget updates by itself if Royal Mail changes a date. You can also download `posting-dates.js` and host it yourself.

## Options

| Attribute | What it does | Default |
|---|---|---|
| `data-dispatch` | Working days you need to pack an order (0 to 10). Each date moves back that many working days and the heading becomes "Order by". | `0` |
| `data-services` | Comma list from `2nd`, `tracked48`, `1st`, `special`, `pf48`, `pf24` | `2nd,tracked48,1st,special` |
| `data-theme` | `light` or `dark` | `light` |
| `data-accent` | Border colour as a hex code | `#14532D` |
| `data-title` | Your own heading | automatic |
| `data-message` | One line of your own under the dates | none |
| `data-credit` | `off` hides the small credit link | on |

## The dates (UK to UK, Christmas 2026)

| Last posting date | Service |
|---|---|
| Friday 18 December | 2nd Class, 2nd Class Signed For |
| Saturday 19 December | Royal Mail Tracked 48 |
| Monday 21 December | 1st Class, 1st Class Signed For, Royal Mail Tracked 24 |
| Wednesday 23 December | Special Delivery Guaranteed |
| Monday 21 December | Parcelforce express48, express48large |
| Tuesday 22 December | Parcelforce express10, expressAM, express24 |

Copied from [Royal Mail's last posting dates page](https://www.royalmail.com/christmas/last-posting-dates) on 23 October 2026. Royal Mail says the dates are correct at the time of publishing and subject to change. This project is not affiliated with Royal Mail.

## Use it in Node

```js
const P = require("./posting-dates.js");
P.compute({ dispatchDays: 1 }).rows.forEach(r => console.log(r.name, r.orderByText, r.label));
```

## Tests

```
node test/test.js
```

## Missed the post?

[Printable Christmas cards](https://www.tchworks.co.uk/shop/printable-christmas-cards/?src=gh-postdates-readme): 15 original designs to print at home, £2.99. Made by [TCH Works](https://www.tchworks.co.uk/?src=gh-postdates-readme), who also write [Christmas newsletters and emails for small UK shops](https://www.tchworks.co.uk/services/newsletters/?src=gh-postdates-readme).
