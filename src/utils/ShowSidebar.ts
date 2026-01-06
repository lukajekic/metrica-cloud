export function SidebarVisibility():boolean {
        const projectID = sessionStorage.getItem('ActiveProject')
        if (!projectID) {
            return false
        } else {
            return true
        }
}