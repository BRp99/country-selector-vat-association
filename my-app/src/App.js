import { useState, useRef, useEffect } from "react"

//fonte dos sistemas de identificação para cada país da UE:
//https://www.avalara.com/vatlive/en/eu-vat-rules/eu-vat-number-registration/eu-vat-number-formats.html
//e também por este site para dupla verificação: https://laendercode.net/de/

const europeanCountrys = [
  { id: 1, nome: "Áustria", codigoISOAlpha2: "AT", pattern: "U[0-9]{8}" }, //começa com 'U' e 8 dígitos
  { id: 2, nome: "Bélgica", codigoISOAlpha2: "BE", pattern: "0[0-9]{9}" }, //começa com 0 e 9 dígitos
  { id: 3, nome: "Bulgária", codigoISOAlpha2: "BG", pattern: "[0-9]{9,10}" }, //pode ter 9 ou 10 dígitos
  { id: 4, nome: "Croácia", codigoISOAlpha2: "HR", pattern: "[0-9]{11}" },
  { id: 5, nome: "Chipre", codigoISOAlpha2: "CY", pattern: "[0-9]{8}L" }, //começa com 8 dígitos e a letra 'L'
  { id: 6, nome: "República Checa", codigoISOAlpha2: "CZ", pattern: "[0-9]{8,10}" },
  { id: 7, nome: "Dinamarca", codigoISOAlpha2: "DK", pattern: "[0-9]{8}" },
  { id: 8, nome: "Eslováquia", codigoISOAlpha2: "SK", pattern: "[0-9]{10}" },
  { id: 9, nome: "Eslovênia", codigoISOAlpha2: "SI", pattern: "[0-9]{8}" },
  { id: 10, nome: "Espanha", codigoISOAlpha2: "ES", pattern: "[0-9A-Z][0-9]{7}[0-9A-Z]" }, //começa com um caractere alfanumérico, depois 7 dígitos e um caractere alfanumérico
  { id: 11, nome: "Estónia", codigoISOAlpha2: "EE", pattern: "[0-9]{9}" },
  { id: 12, nome: "Finlândia", codigoISOAlpha2: "FI", pattern: "[0-9]{8}" },
  { id: 13, nome: "França", codigoISOAlpha2: "FR", pattern: "[0-9A-Z]{2}[0-9]{9}" }, //começa com 2 caracteres alfanuméricos e depois 9 dígitos
  { id: 14, nome: "Grécia", codigoISOAlpha2: "GR", pattern: "[0-9]{9}" },
  { id: 15, nome: "Hungria", codigoISOAlpha2: "HU", pattern: "[0-9]{8}" },
  { id: 16, nome: "Irlanda", codigoISOAlpha2: "IE", pattern: "[0-9]S[0-9]{5}L" }, //começa por um dígito, "S", 5 dígitos e "L"
  { id: 17, nome: "Itália", codigoISOAlpha2: "IT", pattern: "[0-9]{11}" },
  { id: 18, nome: "Letônia", codigoISOAlpha2: "LV", pattern: "[0-9]{11}" },
  { id: 19, nome: "Lituânia", codigoISOAlpha2: "LT", pattern: "[0-9]{9}|[0-9]{12}" },
  { id: 20, nome: "Luxemburgo", codigoISOAlpha2: "LU", pattern: "[0-9]{8}" },
  { id: 21, nome: "Malta", codigoISOAlpha2: "MT", pattern: "[0-9]{8}" },
  { id: 22, nome: "Países Baixos", codigoISOAlpha2: "NL", pattern: "[0-9]{9}B[0-9]{2}" }, //começa por 9 dígitos, "B" e 2 dígitos
  { id: 23, nome: "Polônia", codigoISOAlpha2: "PL", pattern: "[0-9]{10}" },
  { id: 24, nome: "Portugal", codigoISOAlpha2: "PT", pattern: "[0-9]{9}" },
  { id: 25, nome: "Romênia", codigoISOAlpha2: "RO", pattern: "[0-9]{2,10}" },
  { id: 26, nome: "Suécia", codigoISOAlpha2: "SE", pattern: "[0-9]{12}" },
  { id: 27, nome: "Alemanha", codigoISOAlpha2: "DE", pattern: "[0-9]{9}" },
]

export default function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCountries, setFilteredCountries] = useState(europeanCountrys)
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [pattern, setPattern] = useState("") //estado para o respetivo sistema de identificação do país que for selecionado pelo user
  const dropdownRef = useRef(null)

  useEffect(() => {
    const normalizedQuery = normalizeString(searchQuery)
    const filtered = europeanCountrys.filter(
      (country) => normalizeString(country.nome).includes(normalizedQuery) || normalizeString(country.codigoISOAlpha2).includes(normalizedQuery)
    )
    setFilteredCountries(filtered)
    setShowDropdown(normalizedQuery.length > 0 && filtered.length > 0)
  }, [searchQuery])

  // função para normalizar strings, removendo acentos e convertendo para minúsculas
  //'Croácia' não estava a ser aceite caso escreve-se 'Croacia' nem 'croácia'
  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
  }

  const handleInputChange = (event) => {
    const query = event.target.value
    setSearchQuery(query) //atualizo a query de pesquisa
    setHighlightedIndex(-1) //reset o índice destacado
    if (selectedCountry && query !== `${selectedCountry.codigoISOAlpha2} | ${selectedCountry.nome}`) {
      setSelectedCountry(null) //limpo a seleção se o input foi modificado
      setPattern("") //limpo o padrão se a seleção for removida
    }
  }

  const handleKeyDown = (event) => {
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
      handleCountrySelect(filteredCountries[highlightedIndex])
    }
  }

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setSearchQuery(`${country.codigoISOAlpha2} | ${country.nome}`) //mostro o código e o nome ao selecionar
    setPattern(country.pattern) // atualizo o padrão do país selecionado
    setShowDropdown(false) //fecho o dropdown
    setHighlightedIndex(-1) //faço reset  ao índice destacado
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
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShowDropdown(false)
        if (!selectedCountry) {
          //atualizo o searchQuery apenas se nenhum país estiver selecionado
          setSearchQuery("")
        }
      }
    }, 100)
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
  }

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <div style={styles.countrySelector}>
          <label className="fs-5 fw-bold mb-2">País</label>
          <input
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
            <div style={styles.dropdown} ref={dropdownRef}>
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
                : searchQuery && <div style={styles.noResults}>Nenhum resultado encontrado</div>}
            </div>
          )}
        </div>
        <div>
          <label className="fs-5 fw-bold mb-2">NIF / VAT</label>
          <input type="text" placeholder={pattern ? `Padrão: ${pattern}` : "Introduza o NIF / VAT"} style={styles.input} disabled />
        </div>
      </div>
    </div>
  )
}
