import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


const AppModal = ({ show, onClose, onSubmit, submitLabel= "save", cancelLabel="Cancel", isLoading= false, showFooter= true, children, title }) => {
  return (
    <Dialog open={show} openChange={onClose}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="py-2">{children}</div>
          {showFooter && (
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : submitLabel}
            </Button>
            <Button variant="outline" onClick={() => onClose(false)}>
              {cancelLabel}
            </Button>
          </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default AppModal