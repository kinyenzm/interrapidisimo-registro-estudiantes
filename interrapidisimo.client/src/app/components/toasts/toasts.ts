import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificacionesService, TipoNotificacion } from '../../services/notificaciones.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toasts {
  protected readonly servicio = inject(NotificacionesService);

  protected readonly clases: Readonly<Record<TipoNotificacion, string>> = {
    exito: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
  };
}
