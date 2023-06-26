import { H2 } from "../Typography"
import { AuthState } from "./AuthState"

declare interface NavBarProps {
  title?: string;
}

export const NavBar = (props: NavBarProps) => {
  return (
    <div className="h-full flex-1 space-y-8 p-8">
    <div className="md:flex items-center justify-between space-y-2">
        <div>
          <H2>
            {props.title ?? ""}
          </H2>
        </div>
        <div>
          <AuthState />
        </div>
      </div>
    </div>
  )
}
