// Arreglo para almacenar las reservas en memoria
let pacientes = [];
let indiceEditar = -1;

// Al cargar la página, fijar min del datepicker para validar fecha >= hoy
window.addEventListener('DOMContentLoaded', () => {
  const inputFecha = document.getElementById('fecha');
  inputFecha.min = new Date().toISOString().split('T')[0];

  // vincular siempre al mismo botón (Crear o Actualizar)
  document.getElementById('btnRegistrar')
          .addEventListener('click', registrarPaciente);

  // mostrar cualquier reserva ya existenteA
  mostrarPacientes();
});

// Función para Crear o Actualizar (C y U del CRUD)
function registrarPaciente() {
  const nombre    = document.getElementById('nombre').value.trim();
  const matri     = document.getElementById('matri').value.trim();
  const actividad = document.getElementById('actividad').value.trim();
  const fecha     = document.getElementById('fecha').value.trim();

  // a) Validar nombre: al menos 3 letras
  if (nombre.length < 3) {
    alert("El nombre debe tener al menos 3 letras.");
    return;
  }
  // b) Validar nombre: sólo letras y espacios
  if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
    alert("El nombre sólo puede contener letras y espacios.");
    return;
  }

  // c) Validar campos obligatorios
  if (!matri || !actividad || !fecha) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  // d) Validar matrícula: 8 caracteres alfanuméricos y positivos
  if (matri.length !== 8 || isNaN(matri) || parseInt(matri, 10) <= 0) {
    alert("El Código de Matrícula debe tener 8 dígitos numéricos y ser positivo.");
    return;
  }

  // e) Validar fecha: no anterior a hoy
  const fechaSel = new Date(fecha);
  const hoyComp  = new Date();
  hoyComp.setHours(0,0,0,0);
  if (fechaSel < hoyComp) {
    alert("La fecha no puede ser anterior a hoy.");
    return;
  }

  // Si pasa todas las validaciones, armar el objeto reserva
  const paciente = { nombre, matri, actividad, fecha };

  if (indiceEditar === -1) {
    // Crear nuevo (C)
    pacientes.push(paciente);
  } else {
    // Actualizar existente (U)
    pacientes[indiceEditar] = paciente;
    indiceEditar = -1;
    document.getElementById('cancelarBtn').classList.add('d-none');
    document.getElementById('btnRegistrar').textContent = 'Registrar';
  }

  limpiarFormulario();
  mostrarPacientes();  
}

// Función para Leer (mostrar) todas las reservas
function mostrarPacientes() {
  const tabla = document.getElementById('tablaPacientes');
  tabla.innerHTML = '';
  pacientes.forEach((p, i) => {
    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.matri}</td>
        <td>${p.actividad}</td>
        <td>${p.fecha}</td>
        <td>
          <!-- 3. Botón Editar -->
          <button class="btn btn-warning btn-sm" onclick="editarPaciente(${i})">Editar</button>
          <!-- 4. Botón Eliminar -->
          <button class="btn btn-danger btn-sm"  onclick="eliminarPaciente(${i})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// Cargar datos en el formulario para Actualizar (U)
function editarPaciente(i) {
  const p = pacientes[i];
  document.getElementById('nombre').value    = p.nombre;
  document.getElementById('matri').value     = p.matri;
  document.getElementById('actividad').value = p.actividad;
  document.getElementById('fecha').value     = p.fecha;
  indiceEditar = i;
  document.getElementById('cancelarBtn').classList.remove('d-none');
  document.getElementById('btnRegistrar').textContent = 'Actualizar';
}

// Eliminar un registro (D)
function eliminarPaciente(i) {
  if (confirm("¿Deseas eliminar este registro?")) {
    pacientes.splice(i, 1);
    mostrarPacientes();
  }
}

// Cancelar edición y volver a Crear
function cancelarEdicion() {
  limpiarFormulario();
  indiceEditar = -1;
  document.getElementById('cancelarBtn').classList.add('d-none');
  document.getElementById('btnRegistrar').textContent = 'Registrar';
}

// Vaciar formulario para nuevo ingreso
function limpiarFormulario() {
  ['nombre','matri','actividad','fecha'].forEach(id =>
    document.getElementById(id).value = ''
  );
}
