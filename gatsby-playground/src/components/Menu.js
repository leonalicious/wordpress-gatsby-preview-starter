import React from "react"
import { StaticQuery, graphql } from "gatsby"
import MenuItem from "./MenuItem"

/** Define MenuItem fragment and get all primary menu items */
const MENU_QUERY = graphql`
  fragment MenuItem on WPGraphQL_MenuItem {
    id
    label
    url
    title
    target
  }

  query GETMAINMENU {
    wpcontent {
      menuItems(where: {location: PRIMARY}) {
        nodes {
          ...MenuItem
        }
      }
      generalSettings {
        url
      }
    }
  }
`

const Menu = () => {
  return (
    <StaticQuery
      query={MENU_QUERY}
      render={(data) => {
        if (data.wpcontent.menuItems) {
          const menuItems = data.wpcontent.menuItems.nodes
          const wordPressUrl = data.wpcontent.generalSettings.url

       return (
         <div style={{ marginBottom: "20px" }}>
           {
             menuItems &&
             menuItems.map((menuItem) => (
               <MenuItem key={menuItem.id}
               menuItem={menuItem} wordPressUrl={wordPressUrl}/>
             )
           )}
         </div>
       )
      }
      return null
   }}
  />
  )
}

export default Menu