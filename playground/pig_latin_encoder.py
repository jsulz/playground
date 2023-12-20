import re
from flask import Blueprint, render_template, request

ple = Blueprint("pig-latin-encoder", __name__, template_folder="templates")


@ple.route("/pig-latin-encoder", methods=["GET", "POST"])
def pig_latin_encoder():
    if request.method == "POST":
        results = {}
        results["digits"] = set()
        punctuation = {"(", ")", ".", ",", "!", "?", ":", ";", "'", '"'}
        vowels = {"a", "e", "i", "o", "u", "y"}
        # Take the string and split it on ' '
        message = re.findall(r"\S+|\n", request.form["message"])
        for i, word in enumerate(message):
            # for each word, first check to see if the end is a puncuation
            # if it is, count how many letters are puncuation and ignore them
            j = -1
            prefix = word
            suffix = ""
            if word[j] in punctuation:
                while word[j] in punctuation:
                    j -= 1
                j += 1
                prefix = word[:j]
                suffix = word[j:]

            if prefix.find("'") > -1:
                j = prefix.find("'")
                suffix = prefix[j:] + suffix
                prefix = prefix[:j]

            if prefix.isdigit():
                results["error"] = True
                results["digits"].add(prefix)
                continue

            if not prefix.isalpha():
                continue

            # If a word starts with a vowel, just add "way" to the end
            if prefix[0].lower() in vowels:
                prefix += "way"
                message[i] = prefix + suffix
            # If a word starts with a constanant, find the number of constanatns
            # that a word starts with and move them to the end of the word and append with "ay"
            # rejoin the string and return it
            else:
                k = 0
                while prefix[k].lower() not in vowels:
                    k += 1

                titlecase = prefix.istitle()

                if titlecase:
                    new_word = prefix[k:].title() + prefix[:k].lower() + "ay"
                else:
                    new_word = prefix[k:] + prefix[:k] + "ay"

                message[i] = new_word + suffix

        results["encoded"] = " ".join(message)

        return render_template("bbospp/piglatinencoder.html.jinja", results=results)

    return render_template("bbospp/piglatinencoder.html.jinja")
