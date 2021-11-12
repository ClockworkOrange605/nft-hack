import { useHistory } from "react-router-dom"

import { useAuth } from '../../providers/AuthProvider'

import './Templates.css'

import logoP5 from '../../assets/p5js.svg'

function Templates() {
  const history = useHistory()
  const { account } = useAuth()

  function selectTemplate(id, version) {
    console.log(id, version)

    fetch(`/${account}/nft/create/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'x-auth-token': sessionStorage.getItem(account)
      },
      body: JSON.stringify({ type: id, version })
    }).then(async (res) => {
      const data = await res.json()
      const { id } = data
      history.push(`/account/nft/${id}/edit`)
    })
  }

  return (
    <div className="Templates">
      <h1>Choose Template</h1>
      <div className="Template" onClick={() => selectTemplate('blank', 0.1)}>
        <div className="Logo">
          <img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjYWFhYWFhIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIiB2aWV3Qm94PSIwIDAgOC40NjY2NjY3IDguNDY2NjY2OSIgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCI+PHN2ZzpnPjxzdmc6cGF0aCBzdHlsZT0iY29sb3I6IzAwMDAwMDtmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTptZWRpdW07bGluZS1oZWlnaHQ6bm9ybWFsO2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWY7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LXBvc2l0aW9uOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1hbHRlcm5hdGVzOm5vcm1hbDtmb250LWZlYXR1cmUtc2V0dGluZ3M6bm9ybWFsO3RleHQtaW5kZW50OjA7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWRlY29yYXRpb246bm9uZTt0ZXh0LWRlY29yYXRpb24tbGluZTpub25lO3RleHQtZGVjb3JhdGlvbi1zdHlsZTpzb2xpZDt0ZXh0LWRlY29yYXRpb24tY29sb3I6IzAwMDAwMDtsZXR0ZXItc3BhY2luZzpub3JtYWw7d29yZC1zcGFjaW5nOm5vcm1hbDt0ZXh0LXRyYW5zZm9ybTpub25lO3dyaXRpbmctbW9kZTpsci10YjtkaXJlY3Rpb246bHRyO3RleHQtb3JpZW50YXRpb246bWl4ZWQ7ZG9taW5hbnQtYmFzZWxpbmU6YXV0bztiYXNlbGluZS1zaGlmdDpiYXNlbGluZTt0ZXh0LWFuY2hvcjpzdGFydDt3aGl0ZS1zcGFjZTpub3JtYWw7c2hhcGUtcGFkZGluZzowO2NsaXAtcnVsZTpub256ZXJvO2Rpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO29wYWNpdHk6MTtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7Y29sb3ItaW50ZXJwb2xhdGlvbjpzUkdCO2NvbG9yLWludGVycG9sYXRpb24tZmlsdGVyczpsaW5lYXJSR0I7c29saWQtY29sb3I6IzAwMDAwMDtzb2xpZC1vcGFjaXR5OjE7dmVjdG9yLWVmZmVjdDpub25lO2ZpbGw6I2FhYWFhYTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC41MjkxNjY2NDtzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjpub3JtYWw7Y29sb3ItcmVuZGVyaW5nOmF1dG87aW1hZ2UtcmVuZGVyaW5nOmF1dG87c2hhcGUtcmVuZGVyaW5nOmF1dG87dGV4dC1yZW5kZXJpbmc6YXV0bztlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlIiBkPSJNIDEuMzIyNDAxMywtMS42NjY2NjY3ZS03IEEgMC4yNjQ2MDk3OSwwLjI2NDYwOTc5IDAgMCAwIDEuMDU4MzM0MywwLjI2NTYxNjgzIFYgOC4yMDMxMTY4IGEgMC4yNjQ2MDk3OSwwLjI2NDYwOTc5IDAgMCAwIDAuMjY0MDY3LDAuMjYzNTUgaCA1LjgyMTg2OCBhIDAuMjY0NjA5NzksMC4yNjQ2MDk3OSAwIDAgMCAwLjI2NDA2NSwtMC4yNjM1NSB2IC01LjkxMDIzMyBhIDAuMjY0NjA5NzksMC4yNjQ2MDk3OSAwIDAgMCAtMC4wNzg1NSwtMC4xODc1ODYgbCAtMi4wMjUyLC0yLjAyNzI2NTk3IEEgMC4yNjQ2MDk3OSwwLjI2NDYwOTc5IDAgMCAwIDUuMTE2OTk5MywxLjgzMzMzMzNlLTYgWiBNIDEuNTg4MDE5MywwLjUyOTE2NjgzIGggMy40MTk0MjcgbCAxLjg3MTIwNSwxLjg3Mjc1Mzk3IHYgNS41MzU1NzkgaCAtNS4yOTA2MzIgeiBtIDEuNzU4MDMyLDMuMzc3NTcxOTcgYSAwLjI2NDYwOTc5LDAuMjY0NjA5NzkgMCAwIDAgLTAuMDI5OTcsMC4wMDE2IDAuMjY0NjA5NzksMC4yNjQ2MDk3OSAwIDAgMCAtMC4xNzU3MDIsMC4wOTE0NyBsIC0wLjc3NzIxMywwLjg4Njc2OSBhIDAuMjY0NjA5NzksMC4yNjQ2MDk3OSAwIDAgMCAwLDAuMzQ5ODQ5IGwgMC43NzcyMTMsMC44ODQ3MDEgYSAwLjI2NDYwOTc5LDAuMjY0NjA5NzkgMCAxIDAgMC4zOTg0MjYsLTAuMzQ3NzgzIGwgLTAuNjI0NzY5LC0wLjcxMzEzNSAwLjYyNDc2OSwtMC43MTA1NTEgYSAwLjI2NDYwOTc5LDAuMjY0NjA5NzkgMCAwIDAgLTAuMTkyNzUyLC0wLjQ0Mjg2NyB6IG0gMS43Njg4ODIsMC4wMDE2IGEgMC4yNjQ2MDk3OSwwLjI2NDYwOTc5IDAgMCAwIC0wLjE4NzA2OCwwLjQ0MTMxNyBsIDAuNjI0NzY5LDAuNzEwNTUxIC0wLjYyNDc2OSwwLjcxMzEzNSBhIDAuMjY0NjA5NzksMC4yNjQ2MDk3OSAwIDEgMCAwLjM5ODQyNSwwLjM0Nzc4MyBsIDAuNzc3MjE0LC0wLjg4NDcwMSBhIDAuMjY0NjA5NzksMC4yNjQ2MDk3OSAwIDAgMCAwLC0wLjM0OTg0OSBsIC0wLjc3NzIxNCwtMC44ODY3NjggYSAwLjI2NDYwOTc5LDAuMjY0NjA5NzkgMCAwIDAgLTAuMjExMzU3LC0wLjA5MTQ3IHogbSAtMC42NjQwNCwwLjAyODk0IGEgMC4yNjQ2MDk3OSwwLjI2NDYwOTc5IDAgMCAwIC0wLjI0MTg0NSwwLjE5OTQ3MSBsIC0wLjQ2MDk1NSwxLjcxODc1OCBhIDAuMjY0NjA5NzksMC4yNjQ2MDk3OSAwIDEgMCAwLjUwOTUyOSwwLjEzODQ5MyBsIDAuNDYwOTU1LC0xLjcyMDgyNiBhIDAuMjY0NjA5NzksMC4yNjQ2MDk3OSAwIDAgMCAtMC4yNjc2ODQsLTAuMzM1ODk2IHoiPjwvc3ZnOnBhdGg+PC9zdmc6Zz48L3N2Zz4=" />
        </div>
        <p>Blank Page</p>
      </div>

      <div className="Template" onClick={() => selectTemplate('p5js', 0.1)}>
        <div className="Logo">
          <img src={logoP5} />
        </div>
        <p>p5.js</p>
      </div>

      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming Soon ...</p>
      </div>

      {/* <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div> */}

      {/* <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div> */}

      {/* <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div>
      <div className="Template disabled">
        <div className="Logo"></div>
        <p>Coming soon ...</p>
      </div> */}
    </div>
  )
}

export default Templates