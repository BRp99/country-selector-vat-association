import { useState, useRef, useEffect } from "react"

//fonte dos sistemas de identificação para cada país da UE:
//https://www.avalara.com/vatlive/en/eu-vat-rules/eu-vat-number-registration/eu-vat-number-formats.html
//e também por este site para dupla verificação: https://laendercode.net/de/

const europeanCountrys = [
  {
    id: 1,
    nome: "Áustria",
    codigoISOAlpha2: "AT",
    pattern: "[Uu][0-9]{8}",
    exampleVAT: "U12345678",
    descricaoExampleVAT: 'Tem de começar com a letra "U", seguida de 8 números.',
  },
  {
    id: 2,
    nome: "Bélgica",
    codigoISOAlpha2: "BE",
    pattern: "0[0-9]{9}",
    exampleVAT: "0123456789",
    descricaoExampleVAT: 'Tem de começar com "0" e ser seguido por 9 números.',
  },
  {
    id: 3,
    nome: "Bulgária",
    codigoISOAlpha2: "BG",
    pattern: "[0-9]{9,10}",
    exampleVAT: "123456789 ou 0123456789",
    descricaoExampleVAT: "Pode ter 9 ou 10 números.",
  },
  { id: 4, nome: "Croácia", codigoISOAlpha2: "HR", pattern: "[0-9]{11}", exampleVAT: "12345678901", descricaoExampleVAT: "Tem de ter 11 números." },
  {
    id: 5,
    nome: "Chipre",
    codigoISOAlpha2: "CY",
    pattern: "[0-9]{8}[Ll]",
    exampleVAT: "12345678L",
    descricaoExampleVAT: 'Tem de começar com 8 números e terminar com a letra "L".',
  },
  {
    id: 6,
    nome: "República Checa",
    codigoISOAlpha2: "CZ",
    pattern: "[0-9]{8,10}",
    exampleVAT: "12345678 ou 0123456789",
    descricaoExampleVAT: "Pode ter entre 8 e 10 números.",
  },
  { id: 7, nome: "Dinamarca", codigoISOAlpha2: "DK", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 números." },
  { id: 8, nome: "Eslováquia", codigoISOAlpha2: "SK", pattern: "[0-9]{10}", exampleVAT: "1234567890", descricaoExampleVAT: "Tem de ter 10 números." },
  { id: 9, nome: "Eslovênia", codigoISOAlpha2: "SI", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 números." },
  {
    id: 10,
    nome: "Espanha",
    codigoISOAlpha2: "ES",
    pattern: "[0-9A-Za-z][0-9]{7}[0-9A-Za-z]",
    exampleVAT: "X12345678",
    descricaoExampleVAT: "Começa com um caractere alfanumérico, seguido por 7 números e um caractere alfanumérico.",
  },
  { id: 11, nome: "Estónia", codigoISOAlpha2: "EE", pattern: "[0-9]{9}", exampleVAT: "123456789", descricaoExampleVAT: "Tem de ter 9 números." },
  { id: 12, nome: "Finlândia", codigoISOAlpha2: "FI", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 números." },
  {
    id: 13,
    nome: "França",
    codigoISOAlpha2: "FR",
    pattern: "[0-9A-Za-z]{2}[0-9]{9}",
    exampleVAT: "AB123456789",
    descricaoExampleVAT: "Começa com 2 caracteres alfanuméricos, seguidos de 9 números.",
  },
  { id: 14, nome: "Grécia", codigoISOAlpha2: "GR", pattern: "[0-9]{9}", exampleVAT: "123456789", descricaoExampleVAT: "Tem de ter 9 números." },
  { id: 15, nome: "Hungria", codigoISOAlpha2: "HU", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 números." },
  {
    id: 16,
    nome: "Irlanda",
    codigoISOAlpha2: "IE",
    pattern: "[0-9][Ss][0-9]{5}[Ll]",
    exampleVAT: "1S23456L",
    descricaoExampleVAT: 'Começa com um dígito, seguido pela letra "S", 5 números e termina com a letra "L".',
  },
  { id: 17, nome: "Itália", codigoISOAlpha2: "IT", pattern: "[0-9]{11}", exampleVAT: "12345678901", descricaoExampleVAT: "Tem de ter 11 números." },
  { id: 18, nome: "Letônia", codigoISOAlpha2: "LV", pattern: "[0-9]{11}", exampleVAT: "12345678901", descricaoExampleVAT: "Tem de ter 11 números." },
  {
    id: 19,
    nome: "Lituânia",
    codigoISOAlpha2: "LT",
    pattern: "[0-9]{9}|[0-9]{12}",
    exampleVAT: "123456789 ou 112244556699",
    descricaoExampleVAT: "Pode ter 9 ou 12 números.",
  },
  { id: 20, nome: "Luxemburgo", codigoISOAlpha2: "LU", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 números." },
  { id: 21, nome: "Malta", codigoISOAlpha2: "MT", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 números." },
  {
    id: 22,
    nome: "Países Baixos",
    codigoISOAlpha2: "NL",
    pattern: "[0-9]{9}[Bb][0-9]{2}",
    exampleVAT: "123456789B01",
    descricaoExampleVAT: 'Começa com 9 números, seguido da letra "B" e 2 números.',
  },
  { id: 23, nome: "Polônia", codigoISOAlpha2: "PL", pattern: "[0-9]{10}", exampleVAT: "1234567890", descricaoExampleVAT: "Tem de ter 10 números." },
  { id: 24, nome: "Portugal", codigoISOAlpha2: "PT", pattern: "[0-9]{9}", exampleVAT: "249888776", descricaoExampleVAT: "Tem de ter 9 números." },
  {
    id: 25,
    nome: "Romênia",
    codigoISOAlpha2: "RO",
    pattern: "[0-9]{2,10}",
    exampleVAT: "00 ou 1234567890",
    descricaoExampleVAT: "Pode ter entre 2 e 10 números.",
  },
  { id: 26, nome: "Suécia", codigoISOAlpha2: "SE", pattern: "[0-9]{12}", exampleVAT: "123456789012", descricaoExampleVAT: "Tem de ter 12 números." },
  { id: 27, nome: "Alemanha", codigoISOAlpha2: "DE", pattern: "[0-9]{9}", exampleVAT: "123456789", descricaoExampleVAT: "Tem de ter 9 números." },
]

export default function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCountries, setFilteredCountries] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [exampleVAT, setExampleVAT] = useState("")
  const [vatError, setVatError] = useState("") // mensagem de erro
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const normalizedQuery = normalizeString(searchQuery)
    const filtered = europeanCountrys.filter(
      (country) => normalizeString(country.nome).includes(normalizedQuery) || normalizeString(country.codigoISOAlpha2).includes(normalizedQuery)
    )
    setFilteredCountries(filtered)

    setShowDropdown(searchQuery.length > 0)
  }, [searchQuery])

  useEffect(() => {
    if (selectedCountry) {
      setExampleVAT(selectedCountry.exampleVAT)
    }
  }, [selectedCountry])

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
  }

  const handleInputChange = (event) => {
    const query = event.target.value
    // console.log(`pesquisa do país: ${query}`)
    setSearchQuery(query)
    setHighlightedIndex(-1)

    if (selectedCountry && query !== `${selectedCountry.codigoISOAlpha2} | ${selectedCountry.nome}`) {
      // console.log("país des-selecionado")
      setSelectedCountry(null)
      setExampleVAT("")
    }

    const normalizedQuery = normalizeString(query)
    const filtered = europeanCountrys.filter(
      (country) => normalizeString(country.nome).includes(normalizedQuery) || normalizeString(country.codigoISOAlpha2).includes(normalizedQuery)
    )

    // console.log("paises filtrados:", filtered.map(country => country.nome));
    setFilteredCountries(filtered)
    setShowDropdown(query.length > 0)
  }

  const handleCountrySelect = (country) => {
    console.log(`País selecionado: ${country.nome} (${country.codigoISOAlpha2})`)
    setSelectedCountry(country)
    setSearchQuery(`${country.codigoISOAlpha2} | ${country.nome}`)
    setSearchQuery(`${country.codigoISOAlpha2} | ${country.nome}`)
    setExampleVAT(country.exampleVAT)
    setShowDropdown(false)
    setHighlightedIndex(-1)
  }

  const validateVAT = (vat) => {
    if (!selectedCountry) return

    const { pattern, descricaoExampleVAT, exampleVAT, id } = selectedCountry

    // obtenho o pattern do VAT como Regex
    const regex = new RegExp(`^${pattern}$`)

    const errorMessages = []

    // para países com PATTERNS COMPLEXOS
    if ([1, 2, 5, 10, 13, 16, 22].includes(id)) {
      switch (id) {
        case 1: // Áustria (ID 1): U seguido de 8 números
          if (vat.length < 9) return // Não verificar até que o comprimento mínimo seja atingido
          if (!/^U\d{8}$/i.test(vat)) {
            errorMessages.push('O VAT da Áustria deve começar com "U" seguido de 8 números. Exemplo: U12345678.')
          }
          break
        case 2: // Bélgica (ID 2): Começa com "0" seguido de 9 números
          if (vat.length < 10) return // Não verificar até que o comprimento mínimo seja atingido
          if (!/^0\d{9}$/.test(vat)) {
            errorMessages.push('O VAT da Bélgica deve começar com "0" seguido de 9 números. Exemplo: 0123456789.')
          }
          break
        case 5: // Chipre (ID 5): 8 números seguidos de "L"
          if (vat.length < 9) return // Não verificar até que o comprimento mínimo seja atingido
          if (!/^\d{8}L$/i.test(vat)) {
            errorMessages.push('O VAT de Chipre deve ter 8 números seguidos de "L". Exemplo: 12345678L.')
          }
          break
        case 10: // Espanha (ID 10): Alfanumérico seguido de 7 números e alfanumérico
          if (vat.length < 9) return // Não verificar até que o comprimento mínimo seja atingido
          if (!/^[0-9A-Z]\d{7}[0-9A-Z]$/i.test(vat)) {
            errorMessages.push(
              "O VAT de Espanha deve começar com um caractere alfanumérico, seguido de 7 números e outro caractere alfanumérico. Exemplo: X12345678 ou X1234567X ou x12345678."
            )
          }
          break
        case 13: // França (ID 13): 2 alfanuméricos seguidos de 9 números
          if (vat.length < 11) return // Não verificar até que o comprimento mínimo seja atingido
          if (!/^[0-9A-Z]{2}\d{9}$/i.test(vat)) {
            errorMessages.push("O VAT da França deve ter 2 caracteres alfanuméricos seguidos de 9 números. Exemplo: AB123456789.")
          }
          break
        case 16: // Irlanda (ID 16): 1 dígito, seguido de "S", 5 números e "L"
          if (vat.length < 8) return // Não verificar até que o comprimento mínimo seja atingido
          if (!/^\dS\d{5}L$/i.test(vat)) {
            errorMessages.push('O VAT da Irlanda deve começar com um dígito, seguido de "S", 5 números e terminar com "L". Exemplo: 1S23456L.')
          }
          break
        case 22: // Países Baixos (ID 22): 9 números seguidos de "B" e 2 números
          if (vat.length < 12) return // Não verificar até que o comprimento mínimo seja atingido
          if (!/^\d{9}B\d{2}$/i.test(vat)) {
            errorMessages.push('O VAT dos Países Baixos deve ter 9 números, seguidos da letra "B" e mais 2 números. Exemplo: 123456789B01.')
          }
          break
      }
    } else {
      // para países com pattern menos complexo
      let minLength = 0
      let maxLength = Infinity

      // regex para encontrar padrões de comprimento não fixo
      const lengthMatch = pattern.match(/\{(\d+)(?:,(\d+))?\}/)
      if (lengthMatch) {
        minLength = parseInt(lengthMatch[1], 10)
        maxLength = lengthMatch[2] ? parseInt(lengthMatch[2], 10) : minLength
      } else {
        // para pattern com comprimento fixo
        minLength = pattern.replace(/[^0-9]/g, "").length
        maxLength = minLength
      }

      // apenas valido se o comprimento do VAT for igual ou maior que o mínimo esperado
      if (vat.length < minLength) return

      // checar comprimento
      if (vat.length > maxLength) {
        errorMessages.push(`O NIF/VAT deve ter entre ${minLength} e ${maxLength} caracteres. Exemplo: ${exampleVAT}`)
      }

      //checar caracteres inválidos
      if (/[^0-9A-Z]/.test(vat)) {
        errorMessages.push("O NIF/VAT só pode conter números e letras alfanuméricas.")
      }

      //checar formato com regex se o comprimento for pelo menos o comprimento mínimo esperado
      if (vat.length >= minLength && !regex.test(vat)) {
        errorMessages.push(descricaoExampleVAT)
      }
    }

    // mostro mensagens de erro se o comprimento correto for atingido, para não estar a mostrar mensagens de erro, enquanto o utilizador está a escrever porque é bué borring
    if (errorMessages.length > 0) {
      setVatError(errorMessages.join(" "))
    } else {
      setVatError("")
    }
  }

  const handleVATChange = (event) => {
    const vat = event.target.value
    console.log(`VAT digitado: ${vat}`)
    validateVAT(vat)
  }

  const handleKeyDown = (event) => {
    // console.log(`tecla pressionada: ${event.key}`);
    if (event.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % filteredCountries.length
        scrollToItem(nextIndex)
        return nextIndex
      })
    } else if (event.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => {
        const nextIndex = (prevIndex - 1 + filteredCountries.length) % filteredCountries.length
        scrollToItem(nextIndex)
        return nextIndex
      })
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      console.log("país selecionado com a tecla Enter:", filteredCountries[highlightedIndex].nome)
      handleCountrySelect(filteredCountries[highlightedIndex])
    }
  }

  const scrollToItem = (index) => {
    const dropdownElement = dropdownRef.current
    if (dropdownElement) {
      const itemElement = dropdownElement.children[index]
      if (itemElement) {
        const itemOffsetTop = itemElement.offsetTop
        const itemHeight = itemElement.clientHeight
        const dropdownHeight = dropdownElement.clientHeight

        if (itemOffsetTop < dropdownElement.scrollTop) {
          dropdownElement.scrollTop = itemOffsetTop
        } else if (itemOffsetTop + itemHeight > dropdownElement.scrollTop + dropdownHeight) {
          dropdownElement.scrollTop = itemOffsetTop + itemHeight - dropdownHeight
        }
      }
    }
  }

  const handleFocus = () => {
    setShowDropdown(true)
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement) && !inputRef.current?.contains(document.activeElement)) {
        setShowDropdown(false)
        if (!selectedCountry) {
          setSearchQuery("")
        }
      }
    }, 150)
  }

  const handleMouseDown = (event) => {
    event.preventDefault()
  }

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    inputContainer: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },
    countrySelector: {
      position: "relative",
      width: "300px",
    },
    input: {
      width: "100%",
      padding: "10px",
      boxSizing: "border-box",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      left: "0",
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#fff",
      zIndex: "1000",
      maxHeight: "150px",
      overflowY: "auto",
    },
    dropdownItem: {
      padding: "10px",
      cursor: "pointer",
    },
    dropdownItemHighlighted: {
      backgroundColor: "#f0f0f0",
    },
    noResults: {
      color: "red",
      textAlign: "center",
      padding: "10px",
    },
    error: {
      color: "red",
      marginTop: "5px",
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <div style={styles.countrySelector}>
          <label className="fs-5 fw-bold mb-2">País</label>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            placeholder="Introduza o país ou código"
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
          {showDropdown && (
            <div style={styles.dropdown} ref={dropdownRef} onMouseDown={handleMouseDown}>
              {filteredCountries.length > 0
                ? filteredCountries.map((country, index) => (
                    <div
                      key={country.id}
                      style={{
                        ...styles.dropdownItem,
                        ...(highlightedIndex === index ? styles.dropdownItemHighlighted : {}),
                      }}
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country.codigoISOAlpha2} | {country.nome}
                    </div>
                  ))
                : searchQuery.length > 0 && !selectedCountry && <div style={styles.noResults}>Nenhum resultado encontrado</div>}
            </div>
          )}
        </div>
        <div>
          <label className="fs-5 fw-bold mb-2">NIF / VAT</label>
          <input
            type="text"
            placeholder={exampleVAT ? `Exemplo: ${exampleVAT}` : "Introduza o NIF / VAT"}
            style={styles.input}
            onChange={handleVATChange}
          />
          {vatError && <div style={styles.error}>{vatError}</div>}
        </div>
      </div>
    </div>
  )
}
