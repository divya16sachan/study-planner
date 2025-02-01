"use client"

import { ChevronRight, Folder } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// items: {
//     title,
//     url,
//     icon ?: LucideIcon
//     isActive ?: boolean
//     items ?: {
//         title,
//         url,
//     }
// }

const NavMain = ({ collections }) => {
    console.log(collections);
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Collections</SidebarGroupLabel>
            <SidebarMenu>
                {collections.map((collection, index) => (
                    <Collapsible
                        key={collection._id}
                        asChild
                        defaultOpen={index === 0}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={collection.name}>
                                    <Folder/>
                                    {collection.icon && <collection.icon />}
                                    <span>{collection.name}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {collection.notes?.map((note) => (
                                        <SidebarMenuSubItem key={note.name}>
                                            <SidebarMenuSubButton asChild>
                                                <a href={note.url}>
                                                    <span>{note.name}</span>
                                                </a>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>

                        </SidebarMenuItem>
                    </Collapsible>
                ))}
                
            </SidebarMenu>
        </SidebarGroup>
    )
}

export default NavMain