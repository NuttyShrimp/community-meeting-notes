import { H2 } from "../Typography"
import { AuthState } from "./AuthState"

export const NavBar = () => {
  return (
    <div className="h-full flex-1 space-y-8 p-8">
    <div className="md:flex items-center justify-between space-y-2">
        <div>
          <H2>
            DeGrens community meeting notes
          </H2>
        </div>
        <div>
          <AuthState />
        </div>
      </div>
    </div>
  )
}
