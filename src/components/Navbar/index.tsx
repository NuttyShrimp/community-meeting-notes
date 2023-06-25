import { H2 } from "../Typography"
import { Auth } from "./Auth"

export const NavBar = () => {
  return (
    <div className="h-full flex-1 space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <H2>
            DeGrens community meeting notes
          </H2>
        </div>
        <div>
          <Auth />
        </div>
      </div>
    </div>
  )
}
