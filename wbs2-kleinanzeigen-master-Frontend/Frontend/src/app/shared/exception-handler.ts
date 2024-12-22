import { HttpErrorResponse } from "@angular/common/http"
import { ToastrService } from "ngx-toastr"

export class ExceptionHandler {
    static handleError(e: any, toasterService: ToastrService) {
        if(e instanceof HttpErrorResponse) {
            toasterService.error(e.error.message, e.statusText)
        } else if(e instanceof Error) {
            toasterService.error(e.message)
        }
        else {
            toasterService.error("Ooops... irgendwas ist schiefgegangen\nSchau mal den Log an")
            console.error(e)
        }
    }
    static modalDismissed() {
        console.log("Modal dismissed...")
    }
}
